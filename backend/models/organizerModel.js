import dotenv from 'dotenv';
import knex from 'knex';
import {dirname, join} from 'path';
import knexConfig from '../config/knexFile.js';

dotenv.config();

const db = knex(knexConfig);

const OrganizerModel = {
    async createUserModel (user) {
        try{
            const { username, email, password, phone, role } = user;

            if(!username || !email || !password || !phone || !role) {
                throw new Error('All fields are required');
            }
            const existingUser = await db('user')
            .where({ email,
                username}).first();
            
            if (existingUser) {
                throw new Error('User already exists');
            }
            const newUser = await db('user').insert({
                username,
                email,
                password,
                phone,
                role,
                created_at: new Date(),
                updated_at: new Date(),
                created_by: 'system'
            }).returning(['id', 'username', 'email', 'phone', 'role']);
            return newUser[0];
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },
    async getAllUsersModel(email) {
        try {
            const users = await db('user')
            .select('*');
        
        if (!users || users.length === 0) {
            throw new Error('No users found');
        }

        return users;
            }
        catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    async loginModel(email, password) {
        try {
            const user = await db('user')
                .where({ email, password })
                .first();
            if (!user) {
                throw new Error('Invalid email or password');
            }
            return user;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },
    
    async createEventModel(event, imageFile) {
    try {
        const { 
            title, 
            description, 
            date,
            start_time,
            end_time, 
            location, 
            organization 
        } = event;

        // Validate required fields
        if (!title || !description || !date || !location || !organization || !start_time || !end_time) {
            throw new Error('Required fields: title, description, date, start_time, end_time, location, organization');
        }

        // Validate date format
        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) {
            throw new Error('Invalid date format');
        }

        // Validate time format (HH:mm)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
            throw new Error('Invalid time format. Use HH:mm format (e.g., 09:00)');
        }

        // Validate that end_time is after start_time
        const [startHour, startMinute] = start_time.split(':').map(Number);
        const [endHour, endMinute] = end_time.split(':').map(Number);
        if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
            throw new Error('End time must be after start time');
        }

        // Create the image path if an image was uploaded
        const imagePath = imageFile ? imageFile.filename : null;

        const newEvent = await db('events').insert({
            title,
            description,
            image: imagePath,
            created_by: 'system',
            date: eventDate,
            start_time,
            end_time,
            created_at: new Date(),
            updated_at: new Date(),
            updated_by: 'system',
            location,
            organization
        }).returning([
            'id',
            'title',
            'description',
            'image',
            'date',
            'start_time',
            'end_time',
            'location',
            'organization',
            'created_at'
        ]);

        return newEvent[0];
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

}
export default OrganizerModel;