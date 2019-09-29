//% weight=10 color=#006000 icon="\uf0a4" block="TM1650"

namespace DIGTM {
    let COMMAND_I2C_ADDRESS = 0x24
    let DISPLAY_I2C_ADDRESS = 0x34
    let _SEG = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];

    let _intensity = 3
    let dbuf = [0, 0, 0, 0]

    /**
     * send command to display
     * @param is command, eg: 0
     */
    function cmd(c: number) {
        pins.i2cWriteNumber(COMMAND_I2C_ADDRESS, c, NumberFormat.Int8BE)
    }

    /**
     * send data to display
     * @param is data, eg: 0
     */
    function dat(bit: number, d: number) {
        pins.i2cWriteNumber(DISPLAY_I2C_ADDRESS + (bit % 4), d, NumberFormat.Int8BE)
    }



    /**
     * clear display content
     */
    //% blockId="HaodaBit_TM650_CLEAR" block="4DigitDisplay clear display"
    //% weight=40 blockGap=8
    export function clear() {
        dat(0, 0)
        dat(1, 0)
        dat(2, 0)
        dat(3, 0)
        dbuf = [0, 0, 0, 0]
    }

    /**
     * show a digital in given position
     * @param digit is number (0-15) will be shown, eg: 1
     * @param bit is position, eg: 0
     */
    //% blockId="HaodaBit_TM650_DIGIT" block="4DigitDisplay show digit %num|at %bit"
    //% weight=80 blockGap=8
    //% num.max=9 num.min=0
    export function digit(num: number, bit: number) {
        let beap = bit - 1;
        dbuf[beap % 4] = _SEG[num % 16]
        dat(beap, _SEG[num % 16])
    }

     function digit1(num: number, bit: number) {
        dbuf[bit % 4] = _SEG[num % 16]
        dat(bit, _SEG[num % 16])
    }

    /**
     * show a number in display
     * @param num is number will be shown, eg: 100
     */
    //% blockId="HaodaBit_TM650_SHOW_NUMBER" block="4DigitDisplay show number %num"
    //% weight=100 blockGap=8
    export function showNumber(num: number) {
        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            digit1(Math.idiv(num, 1000) % 10, 0)
        digit1(num % 10, 3)
        digit1(Math.idiv(num, 10) % 10, 2)
        digit1(Math.idiv(num, 100) % 10, 1)
    }


    /**
     * show Dot Point in given position
     * @param bit is positiion, eg: 0
     * @param show is true/false, eg: true
     */
    //% blockId="HaodaBit_TM650_SHOW_DP" block="4DigitDisplay show dot point %bit|show %num"
    //% weight=80 blockGap=8
    export function showDpAt(bit: number, show: boolean) {
        let baep = bit - 1;
        if (show) dat(baep, dbuf[baep % 4] | 0x80)
        else dat(baep, dbuf[baep % 4] & 0x7F)
    }


}