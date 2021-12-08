export interface MovieInfo {
    actors: string[];
    release_date: Date;
    plot: string;
    genres: string[];
    image_url: string;
    directors: string[];
    rating: number;
    rank: number;
    running_time_secs: number;
}

export class Movie {
    title: string;
    year: number;
    info: MovieInfo;

    constructor(defaultValues: string | Partial<Movie> = '') {
        Object.keys(defaultValues).forEach((key) => {
            this[key] = defaultValues[key];
        });
    
    }

}

export function mapToMovie(data: unknown): Movie {
    return new Movie(data);
}
export function mapToMovies(data: unknown[]): Movie[] {
    console.log('hi from map - length is ', data.length);
    if (data.length) {
        const allData = data.map(mapToMovie);
        return allData;
    } else {
        return null;
    }
}

export interface StartKeyInterface {
    title: string;
    year: string;
}

export interface MovieResponse {
    Items: Movie[];
    Count: number;
    last: boolean;
    LastEvaluatedKey: StartKeyInterface;
}
