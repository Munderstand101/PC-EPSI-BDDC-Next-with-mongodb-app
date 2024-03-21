// models/Movie.js
export default class Movie {
    constructor({
                    plot,
                    genres,
                    runtime,
                    cast,
                    poster,
                    title,
                    fullplot,
                    languages,
                    released,
                    directors,
                    rated,
                    awards,
                    lastupdated,
                    year,
                    imdb,
                    countries,
                    type,
                    tomatoes,
                    num_mflix_comments,
                }) {
        this.plot = plot;
        this.genres = genres;
        this.runtime = runtime;
        this.cast = cast;
        this.poster = poster;
        this.title = title;
        this.fullplot = fullplot;
        this.languages = languages;
        this.released = new Date(released);
        this.directors = directors;
        this.rated = rated;
        this.awards = awards;
        this.lastupdated = new Date(lastupdated);
        this.year = year;
        this.imdb = imdb;
        this.countries = countries;
        this.type = type;
        this.tomatoes = tomatoes;
        this.num_mflix_comments = num_mflix_comments;
    }

    static validateRequiredFields(movie) {
        const requiredFields = [
            'plot', 'genres', 'runtime', 'cast', 'poster', 'title', 'fullplot',
            'languages', 'released', 'directors', 'rated', 'awards', 'lastupdated',
            'year', 'imdb', 'countries', 'type', 'tomatoes', 'num_mflix_comments'
        ];

        return requiredFields.every(field => movie[field] !== undefined && movie[field] !== null);
    }
}
