const fs = require("fs")
const dialog = require("node-file-dialog")

let badLines = [/T[0-9]/, /M6/, /M0/, /\(MSG, Change to Tool Dia.{0,10}\)/]

dialog({ type: 'open-files' })
    .then(dir => dir.forEach(nc_file_name => {
        nc_file_name = nc_file_name.replace("\r" , "")
        if (nc_file_name.includes(".nc") && !nc_file_name.includes("_fixed.nc")) {
            try {
                const nc_file_content = fs.readFileSync(nc_file_name, 'utf8');
                console.log(`\nprocessing file ${nc_file_name}`);

                let lines = nc_file_content.split("\n")
                let output_content = ""

                //only check first 50 lines
                for (let i = 0; i < 50; i++) {
                    let l = lines[i]
                    badLines.forEach(word => {
                        if (l && l.match(word)) {
                            console.log(`line ${i+1}: removed ${l}`)
                            lines[i] = ";removed by pcb-gcode-fixer:\t" + l
                        }
                    })
                }

                lines.forEach(l => output_content += l + "\n")

                //write new file
                try {
                    fs.writeFileSync(nc_file_name.replace(".nc", "_fixed.nc"), output_content);
                } catch (err) {
                    console.error(err);
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log(`\nskipping file ${nc_file_name}`)
        }
    }))
    .catch(err => console.error(err))