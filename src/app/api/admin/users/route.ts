import { NextRequest, NextResponse } from 'next/server';

// Mock users data
const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    role: 'SUPER_ADMIN',
    isActive: true,
    createdAt: '2024-01-01T10:00:00Z',
    lastLoginAt: '2024-01-18T14:30:00Z',
    _count: {
      brands: 5,
      branches: 12
    }
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+91 87654 32109',
    role: 'ADMIN',
    isActive: true,
    createdAt: '2024-01-05T09:15:00Z',
    lastLoginAt: '2024-01-17T16:45:00Z',
    _count: {
      brands: 3,
      branches: 8
    }
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    phone: '+91 76543 21098',
    role: 'BRAND_MANAGER',
    isActive: true,
    createdAt: '2024-01-10T11:30:00Z',
    lastLoginAt: '2024-01-16T12:15:00Z',
    _count: {
      brands: 2,
      branches: 5
    }
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+91 65432 10987',
    role: 'BRANCH_ADMIN',
    isActive: false,
    createdAt: '2024-01-12T15:20:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z',
    _count: {
      brands: 1,
      branches: 2
    }
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phone: '+91 54321 09876',
    role: 'EXECUTIVE',
    isActive: true,
    createdAt: '2024-01-15T08:45:00Z',
    lastLoginAt: '2024-01-18T09:20:00Z',
    _count: {
      brands: 0,
      branches: 1
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would fetch from database with proper authentication
    // const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // const user = await verifyToken(token);
    // const users = await db.user.findMany({
    //   include: {
    //     _count: {
    //       select: {
    //         brands: true,
    //         branches: true
    //       }
    //     }
    //   },
    //   orderBy: {
    //     createdAt: 'desc'
    //   }
    // });

    return NextResponse.json({
      success: true,
      users: mockUsers
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, role, password } = body;

    // In a real app, you would:
    // 1. Validate the data
    // 2. Hash the password
    // 3. Create user in database
    // 4. Send welcome email

    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      _count: {
        brands: 0,
        branches: 0
      }
    };

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}