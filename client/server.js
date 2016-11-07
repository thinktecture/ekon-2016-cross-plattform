'use strict';

// Express host for Azure

const express = require('express');
const app = express();

app.use(express.static('build'));

app.listen(process.env.PORT || 8080, () => console.log(`Server up & running.`));
