
"use strict";
const thai2unicode = require('./thai2unicode');


const SELECT = [0x00, 0xA4, 0x04, 0x00, 0x08]
const THAI_CARD = [0xA0, 0x00, 0x00, 0x00, 0x54, 0x48, 0x00, 0x01]
const CMD_CID = [0x80, 0xb0, 0x00, 0x04, 0x02, 0x00, 0x0d]
const CMD_THFULLNAME = [0x80, 0xb0, 0x00, 0x11, 0x02, 0x00, 0x64]
const CMD_ENFULLNAME = [0x80, 0xb0, 0x00, 0x75, 0x02, 0x00, 0x64]
const CMD_BIRTH = [0x80, 0xb0, 0x00, 0xD9, 0x02, 0x00, 0x08]
const CMD_GENDER = [0x80, 0xb0, 0x00, 0xE1, 0x02, 0x00, 0x01]
const CMD_ISSUER = [0x80, 0xb0, 0x00, 0xF6, 0x02, 0x00, 0x64]
const CMD_ISSUE = [0x80, 0xb0, 0x01, 0x67, 0x02, 0x00, 0x08]
const CMD_EXPIRE = [0x80, 0xb0, 0x01, 0x6F, 0x02, 0x00, 0x08]
const CMD_ADDRESS = [0x80, 0xb0, 0x15, 0x79, 0x02, 0x00, 0x64]
const CMD_PHOTO1 = [0x80, 0xb0, 0x01, 0x7B, 0x02, 0x00, 0xFF]
const CMD_PHOTO2 = [0x80, 0xb0, 0x02, 0x7A, 0x02, 0x00, 0xFF]
const CMD_PHOTO3 = [0x80, 0xb0, 0x03, 0x79, 0x02, 0x00, 0xFF]
const CMD_PHOTO4 = [0x80, 0xb0, 0x04, 0x78, 0x02, 0x00, 0xFF]
const CMD_PHOTO5 = [0x80, 0xb0, 0x05, 0x77, 0x02, 0x00, 0xFF]
const CMD_PHOTO6 = [0x80, 0xb0, 0x06, 0x76, 0x02, 0x00, 0xFF]
const CMD_PHOTO7 = [0x80, 0xb0, 0x07, 0x75, 0x02, 0x00, 0xFF]
const CMD_PHOTO8 = [0x80, 0xb0, 0x08, 0x74, 0x02, 0x00, 0xFF]
const CMD_PHOTO9 = [0x80, 0xb0, 0x09, 0x73, 0x02, 0x00, 0xFF]
const CMD_PHOTO10 = [0x80, 0xb0, 0x0A, 0x72, 0x02, 0x00, 0xFF]
const CMD_PHOTO11 = [0x80, 0xb0, 0x0B, 0x71, 0x02, 0x00, 0xFF]
const CMD_PHOTO12 = [0x80, 0xb0, 0x0C, 0x70, 0x02, 0x00, 0xFF]
const CMD_PHOTO13 = [0x80, 0xb0, 0x0D, 0x6F, 0x02, 0x00, 0xFF]
const CMD_PHOTO14 = [0x80, 0xb0, 0x0E, 0x6E, 0x02, 0x00, 0xFF]
const CMD_PHOTO15 = [0x80, 0xb0, 0x0F, 0x6D, 0x02, 0x00, 0xFF]
const CMD_PHOTO16 = [0x80, 0xb0, 0x10, 0x6C, 0x02, 0x00, 0xFF]
const CMD_PHOTO17 = [0x80, 0xb0, 0x11, 0x6B, 0x02, 0x00, 0xFF]
const CMD_PHOTO18 = [0x80, 0xb0, 0x12, 0x6A, 0x02, 0x00, 0xFF]
const CMD_PHOTO19 = [0x80, 0xb0, 0x13, 0x69, 0x02, 0x00, 0xFF]
const CMD_PHOTO20 = [0x80, 0xb0, 0x14, 0x68, 0x02, 0x00, 0xFF]

const enableCardCommand =(card) => {
	return card.issueCommand(Buffer.from(SELECT.concat(THAI_CARD)));
}
const getData = (card,CMD) => {
	let req = [];
	let atr = card.atr;
	let atrBuf = Buffer.from(atr.match(/.{1,2}/g).map(str => `0x${str.toUpperCase()}`))
	if (atrBuf[0] == 0x3B & atrBuf[1] == 0x67){
		req = [0x00, 0xc0, 0x00, 0x01];
	}	
	else{
		req = [0x00, 0xc0, 0x00, 0x00];
	}
	return new Promise( (resolve, reject) => {
		card.issueCommand(Buffer.from(CMD)).then(buffer => {
			return card.issueCommand(Buffer.from(req.concat(CMD[CMD.length-1])));
		}).then(buffer2 => {
			resolve(buffer2.slice(0,buffer2.length-2))
		}).catch(e => {
			reject(e)
		})
	})	
}
const getCID = (card) => {
	return new Promise( (resolve, reject) => {
		getData(card,CMD_CID).then(buff => {
			let CID = thai2unicode(buff);
			resolve(CID)
		}).catch(e=>{
			reject(e);
		})
	})
}
const getTHFullname = (card) => {
	return new Promise( (resolve, reject) => {
		getData(card,CMD_THFULLNAME).then(buff => {
			let fullname = thai2unicode(buff).replace(/#/g,' ');
			resolve(fullname)
		}).catch(e=>{
			reject(e);
		})
	})
}
const getENFullname = (card) => {
	return new Promise( (resolve, reject) => {
		getData(card,CMD_ENFULLNAME).then(buff => {
			let fullname = thai2unicode(buff).replace(/#/g,' ');
			resolve(fullname)
		}).catch(e=>{
			reject(e);
		})
	})
}

const getDateOfBirth = (card) => {
	return new Promise( (resolve, reject) => {
		getData(card,CMD_BIRTH).then(buff => {
			let birth= thai2unicode(buff).replace(/#/g,' ');
			resolve(birth)
		}).catch(e=>{
			reject(e);
		})
	})
}
const getGender = (card) => {
	return new Promise( (resolve, reject) => {
		getData(card,CMD_GENDER).then(buff => {
			let gender = thai2unicode(buff).replace(/#/g,' ');
			resolve(gender)
		}).catch(e=>{
			reject(e);
		})
	})
}

module.exports = {
	enableCardCommand,
	getCID,
	getTHFullname,
	getENFullname,
	getDateOfBirth,
	getGender
}