import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, shopName, address, phone, email, password } = req.body;

    if (!name || !shopName || !address || !phone || !email || !password) {
      return res.status(400).json({ message: 'All fields (Name, Shop Name, Address, Phone, Email, Password) are mandatory.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long, contain uppercase, lowercase, a number and a special character.' 
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create Company first (Shop)
    const company = await prisma.company.create({
      data: {
        name: shopName,
        tier: 'STANDARD',
      }
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role: 'RETAILER' as any, 
        companyId: company.id,
      },
      include: { permissions: true }
    });

    res.status(201).json({ 
      message: 'Retailer registered successfully', 
      user: { id: user.id, email: user.email, role: user.role } 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required' });
    }

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { 
        company: true,
        permissions: true
      }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      message: 'Logged in successfully',
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name,
        phone: user.phone,
        address: user.address,
        company: user.company,
        isSuperAdmin: user.isSuperAdmin,
        permissions: user.permissions
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        company: true,
        permissions: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userData } = user;
    res.status(200).json(userData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ 
        message: 'New password must be at least 8 characters long, contain uppercase, lowercase, a number and a special character.' 
      });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
