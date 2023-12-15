const fs = require("fs")
const dialog = require("node-file-dialog")

let badLines = ["T1", "M6", "(MSG, Change to Tool Dia", "G00 Z15.0000"]

dialog({ type: 'open-files' })
    .then(dir => dir.forEach(nc_file_name => {
        try {
            const nc_file_content = fs.readFileSync(nc_file_name, 'utf8');
            console.log(nc_file_content);

            //replace nc file content

            try {
                fs.writeFileSync(nc_file_name.replace(".nc", "") + "_fixed.nc", nc_file_content);
            } catch (err) {
                console.error(err);
            }
        } catch (err) {
            console.error(err);
        }
    }))
    .catch(err => console.error(err))