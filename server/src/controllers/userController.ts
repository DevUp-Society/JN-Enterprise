import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWorkforce = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // dept and lastLogin are mocked for UI completeness until schema is updated
      }
    });

    const workforce = users.map(u => ({
      ...u,
      dept: u.role === 'ADMIN' ? 'Management' : 'Logistics',
      lastLogin: 'Today',
      status: 'ACTIVE'
    }));

    res.status(200).json({
      status: 'SUCCESS',
      results: workforce.length,
      workforce
    });
  } catch (error) {
    next(error);
  }
};

export const createPersonnel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, dept } = req.body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // In a real app, hash this
        role
      }
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Personnel unit enrolled successfully',
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    next(error);
  }
};

export const deactivatePersonnel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Simulating deactivation protocol
    res.status(200).json({
      status: 'SUCCESS',
      userId: id,
      message: 'Security protocol: Node deactivated'
    });
  } catch (error) {
    next(error);
  }
};
