'use strict';

import htmlTags from './html-tags';



const basic = /\s?<!doctype html>|(<html\b[^>]*>|<body\b[^>]*>|<x-[^>]+>)+/i;
const full = new RegExp(htmlTags.map(x => `<${x}\\b[^>]*>`).join('|'), 'i');

const isHtml = (input) => basic.test(input) || full.test(input);

export default isHtml;