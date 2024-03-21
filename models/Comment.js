// models/Comment.js
export default class Comment {
    constructor({
                    name,
                    email,
                    text,
                    date,
                    movie_id
                }) {
        this.name = name;
        this.email = email;
        this.text = text;
        this.date = new Date(date);
        this.movie_id = movie_id;
    }

    static validateRequiredFields(comment) {
        const requiredFields = ['name', 'email', 'text', 'date', 'movie_id'];
        return requiredFields.every(field => comment[field] !== undefined && comment[field] !== null);
    }
}
