
const puppeteer = require('puppeteer');
const fs = require('fs');
let total_array = [];

//Puppeteer collection of airports
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 10,
        detools:false
    });
    const page = await browser.newPage();
    await page.goto('https://en.wikipedia.org/wiki/Lists_of_airports', {
        waitUntil: 'networkidle2',
    });
    let clickurl = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // Loop for Getting the table vaule from A -Z
    for (let i = 0; i < clickurl.length; i++) {
        await Promise.all([page.click("a[href='/wiki/List_of_airports_by_IATA_airport_code:_" + clickurl[i] + "']", { clickCount: 1 }),
        page.waitForNavigation({ waitUntil: 'networkidle2' })])
        const dimensions = await page.$$eval('.wikitable', (trows) => trows.map((n) => n.innerText))
        let temp = JSON.stringify(dimensions);
        await stage1(temp);

        //percentage completed
        console.log((i * 100 / 26).toFixed(2) + "%");

        await page.goBack();
    }

    sendfile(total_array);

    await browser.close();
})();
//Making a fragment 

let stage1 = (temp) => {
    temp = temp.split("\\n");
    for (let i = 1; i < temp.length; i++) {
        stage2(temp[i]);
    }
}

//Making a sub-fragment 
let stage2 = (temp) => {
    temp = JSON.stringify(temp);
    let temp1 = temp.split("\\t");
    if (temp1[2]) {
        let obj = {
            IATA: ((temp1[0])) ? temp1[0].replace(/\\/g, " ") : null,
            ICAO: ((temp1[1])) ? temp1[1].replace(/\\/g, " ") : null,
            airport_name: ((temp1[2])) ? temp1[2].replace(/\\/g, " ") : null,
            Location_served: ((temp1[3])) ? temp1[3].replace(/\\/g, " ") : null,
            Time: ((temp1[4])) ? temp1[4].replace(/\\/g, " ") : null,
            DST: ((temp1[5])) ? temp1[5].replace(/\\/g, " ") : null
        }
        total_array.push(obj);

    }
}

// sending the data to the json file
let sendfile =(obj)=> {
    console.log(" Making a File");
            let json = JSON.stringify(obj,null,4);
            fs.writeFile('data..json', json, function (err, result) {
                if (err) console.log('error', err);
                 console.log("Completed!!");
            });
     
}