export default class Champion {
    constructor(data) {
        this.key = data.key;                          
        this.id = data.id;
        this.name = data.name;
        this.title = data.title
        this.lore = data.blurb
        this.image = data.image
        
    }
}