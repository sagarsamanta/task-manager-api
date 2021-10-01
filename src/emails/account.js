const sendgridMail=require('@sendgrid/mail')
sendgridApiKey=''
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWellcomeEmail=(email,name)=>{
    sendgridMail.send({
        to:email,
        from:'sagarsamanta392@gmail.com',
        subject:'Wellcome from Task-Manager..!',
        text:`Wellcome ${name} hope you are enjoyed you journy with our site..!`
    })
}
const sendCancelEmail=(email,name)=>{
    sendgridMail.send({
        to:email,
        from:'sagarsamanta392@gmail.com',
        subject:'Account remove confermation from Task-Manager..!',
        text:`Hello , ${name} you can tell us what is the reson for you accout deletion ..!`
    })
}
module.exports={sendWellcomeEmail,sendCancelEmail}