class core {
    constructor () {}
    DeltaECIE ( color1, color2 ){
        let similar_score = Math.sqrt ( Math.pow ( ( color1[0] - color2[0] ), 2 )
            + Math.pow ( ( color1[1] - color2[1] ), 2 )
            + Math.pow ( (color1[2] - color2[2] ), 2));
        return similar_score;
    }
}

module.exports = new core();

