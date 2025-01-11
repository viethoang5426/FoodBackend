var {otpEmailModel} = require('../models/otp.model');

const mongoose = require('mongoose');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const sendToUserEmail = require("../Ultis/mail");


const nodemailer = require('nodemailer');
const timeZone = 'Asia/Ho_Chi_Minh';
var now = moment().tz(timeZone);


const bcrypt = require('bcrypt');
var objReturn = {
    status: 1,
    msg: 'OK'
}

exports.sendotp = async (req, res) => {
    try {
      const { Email } = req.body;
  
      const otp = generateRandomOTP();
      const endOTPTime = new Date(Date.now() + 60 * 1000);
      const otpMailCheck = await otpEmailModel.findOne({ Email: Email });
      if (!otpMailCheck) {
        const newOtp = new otpEmailModel({
          Email: Email,
          expiresat: endOTPTime,
          otp: otp,
        });
        await newOtp.save();
      } else {
        (otpMailCheck.otp = otp),
          (otpMailCheck.expiresat = endOTPTime),
          await otpMailCheck.save();
      }
  
      await sendToUserEmail({
        Email : Email,
        subject: "Nhập OTP sau để lấy lại mật khẩu ",
        html: `<b1> Mã OTP kích hoạt của bạn là :  ${otp}<b1/>`,
      });
      res.status(200).send("Đã gửi OTP vào Email");
    } catch (error) {
      res.status(500).send(error);
    }

  };
  
  //Check OTP
  
  exports.checkOTP = async (req, res) => {
    try {
      const { otp, Email } = req.body;
      const otpCheck = await otpEmailModel.findOneAndDelete(
        { Email : Email, otp: otp },
        { new: true }
      );
  
      if (otpCheck) {
        console.log('ok');
        res.status(200).send("OTP chính xác");
      } else {
        res.status(400).send("Sai OTP");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  function generateRandomOTP() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
