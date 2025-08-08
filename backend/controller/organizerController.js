import OrganizerModel from "../models/organizerModel.js";

const organizerController = {
    async createUser(req, res){
        try{
            const user = {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                phone: req.body.phone,  
                role: req.body.role
            }

             // Input validation
            if (!user.username || !user.email || !user.password || !user.phone || !user.role) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                });
            }

            const validRoles = ['admin', 'organizer', 'attendee'];
            if (!validRoles.includes(user.role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role. Must be admin, organizer, or attendee'
                });
            }

            const newUser = await OrganizerModel.createUserModel(user);
            console.log("NewUser:", newUser);
            return res.status(200).json({
                success: true,
                message: "New user created successfully"
            });
        }
        catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    async getAllUsers(req, res) {
        try {
            // const email = req.body.email;
            // if (!email) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Email is required'
            //     });
            // }
            const user = await OrganizerModel.getAllUsersModel();
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            return res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }
            const user = await OrganizerModel.loginModel(email, password);
            return res.status(200).json({
                success: true,
                message: 'Login successful'
            });
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(401).json({
                success: false,
                message: error.message || 'Invalid email or password'
            });
        }
    },

    async createEvent(req, res) {
        try {
            const eventData = {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                location: req.body.location,
                organization: req.body.organization
            };

            // Basic input validation
            const requiredFields = ['title', 'description', 'date', 'start_time', 'end_time', 'location', 'organization'];
            const missingFields = requiredFields.filter(field => !eventData[field]);
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            // Date validation
            const eventDate = new Date(eventData.date);
            if (isNaN(eventDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Use YYYY-MM-DD format'
                });
            }

            // Time format validation
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(eventData.start_time) || !timeRegex.test(eventData.end_time)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid time format. Use HH:mm format (e.g., 09:00)'
                });
            }

            // Get the uploaded image file
            const imageFile = req.file;

            // Create event using the model
            const newEvent = await OrganizerModel.createEventModel(eventData, imageFile);

            return res.status(201).json({
                success: true,
                message: 'Event created successfully',
                data: newEvent
            });

        } catch (error) {
            console.error('Controller Error:', error);
            
            // Handle specific error cases
            if (error.message.includes('Required fields')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('Invalid time format')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('End time must be after start time')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            // Generic error response
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

};

export default organizerController;