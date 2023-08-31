import * as Joi from "joi";

export function validateCreatePost(post){
    const Schema = Joi.object().keys({
        title: Joi.string().label("Title").required(),
        story: Joi.string().label("Story").required(),
        attachment: Joi.object().label("Post attachment")
    });
    return Schema.validate(post);
}


export function validateEditPost(post){
    const Schema = Joi.object().keys({
        title: Joi.string().label("Title"),
        story: Joi.string().label("Story"),
        attachment: Joi.object().label("Post attachment")
    });
    return Schema.validate(post);
}