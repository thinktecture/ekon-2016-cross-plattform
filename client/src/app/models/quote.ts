export class Quote {
    public id: string;
    public quote: string;
    public source: string;

    constructor() {
    }

    public serialize(): Object {
        return {
            id: this.id,
            quote: this.quote,
            source: this.source
        };
    }

    public static deserialize(obj: any): Quote {
        const quote = new Quote();
        quote.id = obj.id;
        quote.quote = obj.quote;
        quote.source = obj.source;

        return quote;
    }
}
