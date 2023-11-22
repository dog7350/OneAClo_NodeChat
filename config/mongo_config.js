const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const oacChatLogSchema = new Schema({
                                    site : String, // 대상
                                    img : String, // 프로필 사진
                                    writer : String, // 작성자
                                    nick : String, // 닉네임
                                    ext : String, // 확장자
                                    content : String // 내용
                                }, { timestamps : true }); // 작성시간

module.exports = mongoose.model("oacChatLog", oacChatLogSchema);