const User = require('../models/user.model');

/**
 * Add a new user
 * 
 * @param {Array|User} req.body - @see user.model
 * 
 * @return {User}
 */
exports.post = async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            let _user = _created = null;

            Object.values(req.body).forEach(async (user) => {
                _user    = new User(user);
                _created = await _user.save();
            });

            res.status(201);
            res.json({ message : "Created", request: req.body });
        } else {
            const user    = new User(req.body);
            const created = await user.save();

            res.status(201);
            res.json(created);
        }
    } catch (error) {
        res.status(500);
        res.json({ message: "Erreur serveur." });

        console.log(error);
    }
}

/**
 * Get User by id
 * 
 * @param {Int} req.params.id_user - User id's 
 * 
 * @return {User}
 */
exports.getById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id_user);
        
        res.status(200);
        res.json(user);
    } catch (error) {
        res.status(500);
        res.json({ message: "Erreur serveur." });

        console.log(error);
    }
}

/**
 * Get all Users
 *  
 *  @return {Array}
 */
exports.get = async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200);
        res.json(users);
    } catch (error) {
        res.status(500);
        res.json({ message: "Erreur serveur." });

        console.log(error);
    }
}

/**
 * Update User
 * 
 * @param {Int} req.params.id_user - User's id
 * 
 * @return {User}
 * 
 */
exports.put = async (req, res) => {
    try {
        const modified_user = await User.findByIdAndUpdate(req.params.id_user, req.body, { new: true });

        res.status(202);
        res.json(modified_user);
    } catch (error) {
        res.status(500);
        res.json({ message: "Erreur serveur." });

        console.log(error);
    }
}

/**
 * Delete User
 * 
 * @param {Int} req.params.id_user - User's id
 * 
 * @return {Object}
 */
exports.delete = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id_user);

        res.status(200);
        res.json({message: "Article supprimé"});
    } catch (error) {
        res.status(500);
        res.json({ message: "Erreur serveur." });

        console.log(error);
    }
}