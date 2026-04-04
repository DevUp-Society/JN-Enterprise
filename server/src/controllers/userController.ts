import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    const users = await prisma.user.findMany({
      where: role ? { role: role as any } : {},
      include: { permissions: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    // Email Registry Conflict Check
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
       return res.status(400).json({ message: 'Email node already exists in our registry.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        permissions: role === 'ADMIN' && permissions ? {
          create: {
            canViewInventory: permissions.inventory ?? false,
            canManageProducts: permissions.products ?? false,
            canManageOrders: permissions.orders ?? false,
            canViewAnalytics: permissions.overview ?? false,
            canManagePartners: permissions.partners ?? false,
            canManageUsers: permissions.settings ?? false,
          }
        } : undefined
      },
      include: { permissions: true }
    });

    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
       return res.status(400).json({ message: 'Authorization Node Conflict: Email already registered.' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateUserPermissions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { permissions } = req.body;

    const updatedPermissions = await prisma.permissions.upsert({
      where: { userId },
      update: {
        canViewInventory: permissions.inventory,
        canManageProducts: permissions.products,
        canManageOrders: permissions.orders,
        canViewAnalytics: permissions.overview,
        canManagePartners: permissions.partners,
        canManageUsers: permissions.settings,
      },
      create: {
        userId,
        canViewInventory: permissions.inventory,
        canManageProducts: permissions.products,
        canManageOrders: permissions.orders,
        canViewAnalytics: permissions.overview,
        canManagePartners: permissions.partners,
        canManageUsers: permissions.settings,
      }
    });

    res.json(updatedPermissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User removed from access nodes.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
