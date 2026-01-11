import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '@/modules/user/domain/entities/user.entity';
import { Role } from '@/modules/user/domain/entities/role.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    const roleRepository = app.get<Repository<Role>>(getRepositoryToken(Role));

    console.log('🌱 Starting database seeding...\n');

    // Create Roles
    console.log('📋 Creating roles...');
    const roles = ['admin', 'staff', 'customer'];
    const createdRoles: Role[] = [];

    for (const roleName of roles) {
        let role = await roleRepository.findOne({ where: { name: roleName } });

        if (!role) {
            role = roleRepository.create({
                name: roleName,
                description: `${roleName.charAt(0).toUpperCase() + roleName.slice(1)} role`,
            });
            await roleRepository.save(role);
            console.log(`✅ Created role: ${roleName}`);
        } else {
            console.log(`ℹ️  Role already exists: ${roleName}`);
        }

        createdRoles.push(role);
    }

    // Create Admin User
    console.log('\n👤 Creating admin user...');
    const adminEmail = 'admin@decorshop.com';

    let adminUser = await userRepository.findOne({
        where: { email: adminEmail },
        relations: ['roles']
    });

    if (!adminUser) {
        const adminRole = createdRoles.find(r => r.name === 'admin');

        adminUser = userRepository.create({
            firstName: 'Admin',
            lastName: 'System',
            fullName: 'Admin System',
            email: adminEmail,
            passwordHash: await bcrypt.hash('admin123456', 10),
            phone: '+84900000000',
            status: 'active',
        });

        await userRepository.save(adminUser);

        // Assign admin role
        if (adminRole) {
            adminUser.roles = [adminRole];
            await userRepository.save(adminUser);
        }

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Password: admin123456');
    } else {
        console.log('ℹ️  Admin user already exists');
        console.log('📧 Email:', adminEmail);
    }

    // Create Test Users
    console.log('\n👥 Creating test users...');
    const testUsers = [
        {
            email: 'staff@decorshop.com',
            firstName: 'Staff',
            lastName: 'Member',
            password: 'staff123456',
            role: 'staff',
        },
        {
            email: 'customer@decorshop.com',
            firstName: 'Test',
            lastName: 'Customer',
            password: 'customer123456',
            role: 'customer',
        },
    ];

    for (const userData of testUsers) {
        let user = await userRepository.findOne({ where: { email: userData.email } });

        if (!user) {
            const role = createdRoles.find(r => r.name === userData.role);

            user = userRepository.create({
                firstName: userData.firstName,
                lastName: userData.lastName,
                fullName: `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                passwordHash: await bcrypt.hash(userData.password, 10),
                status: 'active',
            });

            await userRepository.save(user);
            if (role) {
                user.roles = [role];
                await userRepository.save(user);
            }

            console.log(`✅ Created ${userData.role}: ${userData.email} / ${userData.password}`);
        } else {
            console.log(`ℹ️  User already exists: ${userData.email}`);
        }
    }

    console.log('\n🎉 Database seeding completed!\n');
    console.log('═══════════════════════════════════════');
    console.log('📝 TEST ACCOUNTS:');
    console.log('═══════════════════════════════════════');
    console.log('Admin:');
    console.log('  Email: admin@decorshop.com');
    console.log('  Password: admin123456');
    console.log('\nStaff:');
    console.log('  Email: staff@decorshop.com');
    console.log('  Password: staff123456');
    console.log('\nCustomer:');
    console.log('  Email: customer@decorshop.com');
    console.log('  Password: customer123456');
    console.log('═══════════════════════════════════════\n');

    await app.close();
    process.exit(0);
}

bootstrap().catch((error) => {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
});
