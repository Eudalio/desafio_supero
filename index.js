const app = require('express')();
const moment = require('moment');
const {Router}  = require('express');
const fs = require('fs')

const input = require('./entrada.json');

app.use('/', Router().get('/', async (req, res, next) => {
    let output = '<Retorno>\n';
    
    for (const item in input) {
        if(item === 'permalink' || item === 'shipping_required' || item === 'sku' || item === 'price' ) {
            continue;
        } else if (item === 'dimensions') {
            for( const dimension in input[item]) {
                output += `\t<${dimension}>${(input[item][dimension]).replace(',', '.')}</${dimension}>\n`
            }
        } else {
            if(item === 'date_created') {
                output += `\t<${item}>${moment(input[item]).format('YYYY-MM-DD')}</${item}>\n`;
            } else if (item === 'description') {
                output += `\t<${item}>${input[item].slice(3, input[item].length - 4)}</${item}>\n`
            } else if (input[item].length === 0) {
                output += `\t<${item}/>\n`
                continue;
            } else if(input[item].length !== 0 && item === 'categories'){
                output += `\t<${item}>\n`
                input[item].map(item => {
                    output += `\t\t<category>\n\t`
                    output += `\t\t<id>${item.id}</id>\n\t`
                    output += `\t\t<name>${item.name}</name>\n`
                    output += `\t\t</category>\n\t`
                })
                output += `</${item}>\n`
            } else {
                output += `\t<${item}>${input[item]}</${item}>\n`
            }
        }
    }

    
    output += '</Retorno>'
    
    fs.writeFile(`${__dirname}/saida.xml`, output, erro => {
        if(erro) {
            throw erro;
        }

        console.log('Escreveu!')
    })
    return res.send(output);
}))

app.listen('3333', _ => console.log('listen on port 3333'))
