var simple = require('simple');
var user = new simple.simplecontroler();
user.register = function()
{
    
    var usermod = this.loadmodel('user');
    this.req.postdata.activated = false;
    var _id = usermod.createObjectId();
    this.req.postdata._id = _id;
    var activationidlink = 'http://www.'+simple.config.BASEURL+'/user/activate/'+_id+'/cli';
    this.req.postdata.type='client';
    usermod.addUser(this.req.postdata,(doc)=>{
        var nodemailer = require('nodemailer');
          
        var smtpTransport = nodemailer.createTransport({
        host: 'smtp.live.com',
        port: 25,
        auth: {
        user: 'jozreel@live.com',
        pass: 'inf200316'
        }});
      var mailOptions={
          from:'noreply@boya.com',
       to : this.req.postdata.email,
       subject : 'Confirmation email from booya',
       text : 'Hello '+this.req.postdata.fullname+' this is a confirmation email sent to you to confirm your account. click this link' +activationidlink+' to acctivate your account'
      }
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
        console.log(error);
        user.jsonResp({error:'Activation email failed'});

      }else{
           console.log("Message sent: " + response.response);
           user.jsonResp(doc);

       }
    });
   
   
});
        
   
    
}

user.registerbusiness = function()
{
    
    var usermod = this.loadmodel('user');
    this.req.postdata.activated = false;
    var _id = usermod.createObjectId();
    this.req.postdata._id = _id;
    var activationidlink = simple.config.BASEURL+'/user/activate/'+_id+'/srv';
    this.req.postdata.type='server';
  
    var tmodel = this.loadmodel('towns');
   var town = this.req.postdata.businesstwn;
   var country = this.req.postdata.country;
   if(this.req.password === this.req.passwordr)
   {
   tmodel.addone(town,country,(tdoc)=>{
       this.req.postdata.businesstwn = tdoc.name; 
       usermod.addUser(this.req.postdata,(doc)=>{
      if(doc.success !== false)
      {
        var nodemailer = require('nodemailer');
          
        var smtpTransport = nodemailer.createTransport({
        host: 'smtp.live.com',
        port: 25,
        auth: {
        user: 'jozreel@live.com',
        pass: 'inf200316'
        }});
      var mailOptions={
          from:'noreply@boya.com',
       to : this.req.postdata.mainemail,
       subject : 'Confirmation email from booya',
       text : 'Hello '+this.req.postdata. contactname+' this is a confirmation email sent to you to confirm your account. click this link ' +activationidlink+' to acctivate your account'
      }
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
        console.log(error);
        user.jsonResp({error:'Activation email failed'});

      }else{
           
           console.log("Message sent: " + response.response);
           user.jsonResp(doc);

       }
    });
   
    }
    else(user.jsonResp(doc));
    });
        
   
    });
   }
   else{
      user.jsonResp({success:false, message:'Passwords do not match',error:'MISMATCH_PASSWD' }); 
   }
 
    
}
user.businessregistrationpage = function()
{
   
    this.loadview('businessregistrar');
}
user.activate = function(activateid,type)
{
    var mod = this.loadmodel('user');
    uid = mod.createObjectId(activateid);
    mod.findAndUpdate({_id:uid,activated:false},{activated:true},(obj,res)=>{
       if(obj === null)
       {
           res.success=false;
           res.message="ERROR USER CANNOT BE ACTIVATED";
            user.jsonResp(res); 
       }
       else
       {   this.viewholder.userid = activateid;
         if(type === 'cli')
           this.loadview('editprofile');
         else if(type === 'srv')
           this.loadview('editbusinessprofile');
           //user.jsonResp(res);
       }
       
      
    });
}
user.editprofile = function(uid)
{
    this.viewholder.userid = uid;
    this.loadview('editprofile');
}
user.findbyid = function(uid)
{ 
   var usermod = this.loadmodel('user');
   var id = usermod.createObjectId(uid);
  
    
    usermod.findOne({_id:id},{password:0,passwordr:0},{},(doc)=>
    {
       if(doc !==null)
       {
       doc.mobilelist = doc.mobile;
       delete doc.mobile;
       if(doc.opendaysexception !== undefined){
        doc.opendaysexception.sort((a,b)=>{
                          
                           return(new Date(a.specialdate) - new Date(b.specialdate));
       });}
       delete doc.password;
       delete doc.passwordr;
       user.jsonResp(doc); 
       }
       else
       {
           user.jsonResp({})
       }
    });
}
user.updateuser = function()
{  var usermod = this.loadmodel('user');
   console.log('lll');
    var _id = usermod.createObjectId(this.req.postdata._id);
   
    var uobj = this.req.postdata;
    delete uobj._id;
    if(this.req.postdata.servicename !== undefined)
    {
        var businessmod = this.loadmodel('businesstype');
        businessmod.addnew(this.req.postdata.servicename,(res)=>{console.log(res);});
    }
    if(this.req.postdata.businesstwn !== undefined)
    {
        console.log('hello with town');
        var town = this.loadmodel('towns');
        var utown = this.req.postdata.businesstwn;
        var country = this.req.postdata.country;
        console.log(utown,country);
        town.addone(utown,country,(tdoc)=>{
        this.req.postdata.businesstwn = tdoc.name; 
        usermod.saveUser(_id, uobj,(res)=>{ 
        
        delete res.password;
        delete res.passwordr;  
        res.mobilelist = doc.mobile;
        delete res.mobile; 
        this.jsonResp(res)});
    });
    }
    else{
        console.log('hello no town');
    usermod.saveUser(_id, uobj,(res)=>{ 
        
        delete res.password;
        delete res.passwordr;   
        this.jsonResp(res)});
    }
}
user.saveprofileimage = function()
{
     var usermod = this.loadmodel('user');
     var _id = usermod.createObjectId(this.req.postdata._id);
      var largeimage = this.req.postdata.largeimage;
     filedata={type:largeimage.type, filename:largeimage.filename};
     
     
    usermod.savetogrid(largeimage.data,filedata,(doc)=>
     {
         var saveobj = {gridid:doc._id, profilethumb:this.req.postdata.profilethumb}
         if(doc._id !== undefined)
         {
             usermod.saveUser(_id, saveobj,(res)=>user.jsonResp(res));
         }
     });
    
}

user.savemobile= function()
{
    var usermod = this.loadmodel('user');
     var _id = usermod.createObjectId(this.req.postdata._id);
     var temp =[];
     temp.push(this.req.postdata.tel);
     
     usermod.addtoarray({_id:_id},temp,'mobile',(doc)=>
     {
         usermod.findOne({_id:_id},{mobile:true}, {},(docm)=>{
            
             docm.mobilelist = docm.mobile;
             delete docm.mobile;
            
             doc.mobile = docm;
            
              user.jsonResp(doc);
            
        });
        
     }
     );
}
user.editbusinessprofile = function(id)
{
    this.viewholder.userid=id;
    this.loadview('editbusinessprofile');
}
user.savelocationdetails =function()
{
    var mod =this.loadmodel('user');
    var id = mod.createObjectId(this.req.postdata._id);
    console.log(this.req.postdata);
    mod.findAndUpdateByID(id,{mapMarkers:this.req.postdata.markers},(doc)=>{user.jsonResp(doc);});
}
user.saveadorphoto = function()
{
     var usermod = this.loadmodel('user');
     var _id = usermod.createObjectId(this.req.postdata._id);
      var largeimage = this.req.postdata.image;
     filedata={type:largeimage.type, filename:largeimage.filename};
     
     
    usermod.savetogrid(largeimage.data,filedata,(doc)=>
     {
         var thumb={gridid:doc._id, mediatype:this.req.postdata.mediatype, thumb:this.req.postdata.imagethumb}
         var temp=[];
         temp.push(thumb);
         if(doc._id !== undefined)
         {
            usermod.addtoarray({_id:_id},temp,'images',(docus)=>
            {
                usermod.findOne({_id:_id},{images:true},{},(docim)=>{
                    docus.imagedata = docim;
                     user.jsonResp(docus);
                });
               
            }
            );
         }
     });
}
user.getimagefromgrid = function(gridid)
{
    var umod = this.loadmodel('user');
    
    var gid = umod.createObjectId(gridid);
    var bits = '';
    umod.streamfromgrid(gid, (chnk, end,closed)=>
    {
        
        if(end === false)
        {
            bits +=chnk;
        }
        else
        {
           // console.log(bits);
            user.jsonResp({file:bits});
        }
        
    });
}
user.saveopeninghours = function()
{
    var usermod = this.loadmodel('user');
    var _id = usermod.createObjectId(this.req.postdata._id);
   
    delete this.req.postdata._id;
    
   // usermod.addtoarray({_id:_id},temp,'opendays', (doc)=>user.jsonResp(doc));
   usermod.findOne({_id:_id, 'opendays.day':this.req.postdata.day},{_id:true},{},(docf)=>
   {
       console.log(docf);
       if(docf === null)
       {  
           
            var temp = [];
            temp.push(this.req.postdata);
            console.log(temp);
          
            usermod.addtoarray({_id:_id},temp,'opendays', (doc)=>user.jsonResp(doc));
       }
       else
       {
            usermod.updateinarray({_id:_id, 'opendays.day':this.req.postdata.day}, {'opendays.$':this.req.postdata},(doc)=>user.jsonResp(doc), false);
       }
   }
   );
  
}
user.savespecialhours = function()
{
  
    var usermod = this.loadmodel('user');
    var _id = usermod.createObjectId(this.req.postdata._id);
    var temp =[];
    delete this.req.postdata._id;
    
   usermod.insertcounters('specialdayid');
    usermod.generateNextSequence('opendaysexceptionid',(oid)=>{
        
        this.req.postdata.specialdayid =parseInt(oid);
         temp.push(this.req.postdata);
          usermod.findOne({$or:[{_id:_id,'opendaysexception.specialdate':this.req.postdata.specialdate, 'opendaysexception.specialopeninghour':this.req.postdata.specialopeninghour},{'opendaysexception.specialdate':this.req.postdata.specialdate, 'opendaysexception.closed':"true"}]}
          ,{_id:true},{},(sdoc)=>
          {
              console.log(sdoc);
             if(sdoc === null)
                 usermod.addtoarray({_id:_id},temp,'opendaysexception', (doc)=>
                 {
                     usermod.findOne({_id:_id}, {opendaysexception:true},{},(docr)=>
                     {
                       if(docr.opendaysexception !==null){
                       docr.opendaysexception.sort((a,b)=>{
                          
                           return(new Date(a.specialdate) - new Date(b.specialdate));
                       });}
                       //console.log(docr);
                       doc.opendaysexception = docr;
                       user.jsonResp(doc)
                     });
                 }); 
             else
             {
                 user.jsonResp({success:false, message:'An exception to the rules of business alrady exist with these parameters', error:'RULE_EXIST'});
             }
          });
         
        
    });
  
}

user.removeopendaysexception = function()
{
    var usermod = this.loadmodel('user');
    
    var _id = usermod.createObjectId(this.req.postdata._id);
   
    usermod.removefromarray({_id:_id},{opendaysexception:{specialdayid:parseInt(this.req.postdata.specialdayid)}},false,(doc)=>
    {
        usermod.findOne({_id:_id}, {opendaysexception:true},{},(docr)=>
        {
            resdoc={};
            resdoc.success=true;
            resdoc.opendaysexception = docr;
            
            user.jsonResp(resdoc);
        });
        
        }
        );
    
}

user.findwithname = function(id)
{
    console.log(id);
    var usermod = this.loadmodel('user');
     var _id = usermod.createObjectId(id);
    usermod.aggregate([{$match:{_id:_id}},{$unwind:"$opendaysexception"},{$sort:{'opendaysexception.specialdate':-1}},{$project:{opendaysexception:true}}],(dd)=>user.jsonResp(dd));
   // usermod.findAndSort({_id:_id},{opendaysexception:true},{'opendaysexception.specialdate':-1},false,(dd)=>user.jsonResp(dd));
}

user.removemobile = function()
{
   
    var usermod = this.loadmodel('user');
    var _id = usermod.createObjectId(this.req.postdata._id);
   
    usermod.removefromarray({_id:_id},{mobile:{$in:[this.req.postdata.mobile]}},false,(doc)=>
    {
        usermod.findOne({_id:_id}, {mobile:true},{},(docr)=>
        {
            resdoc={};
            resdoc.success=true;
            resdoc.mobiles={};
            resdoc.mobiles.mobilelist = docr.mobile;
            resdoc.mobiles._id = docr._id;
            
            user.jsonResp(resdoc);
        });
        
        }
        );
}

user.searchresults = function(needle,needletype)
{
    this.viewholder.searchvalue = this.req.urlencode.checkandecode(needle);
    this.viewholder.searchtype = needletype;
    this.loadview('searchresultpage');
}

user.search = function()
{
    var usermod =this.loadmodel('user');
    console.log(this.req.postdata,'pp');
     var regex = new RegExp(this.req.postdata.searchtext,'i'); 
      if(this.req.postdata.searchtype === 'service')
    usermod.find({'jobs.jobname':{$regex:regex}},{password:false,passwordr:false},{},true,(doc)=>{user.jsonResp(doc); console.log(doc)});
   if(this.req.postdata.searchtype === 'provider')
     usermod.find({businessname:this.req.postdata.searchtext},{password:false,passwordr:false},{},true,(doc)=>user.jsonResp(doc));
}
user.savejob = function()
{
     var usermod = this.loadmodel('user');
    var _id = usermod.createObjectId(this.req.postdata._id);
    var temp =[];
    delete this.req.postdata._id;
    usermod.insertcounters('jobid');
    usermod.generateNextSequence('jobid',(oid)=>{
        this.req.postdata.jobid =parseInt(oid);
         temp.push(this.req.postdata);
        
          var regex = new RegExp(this.req.postdata.jobname,'i'); 
           usermod.findOne({'jobs.jobname':{$regex:regex}},{_id:true},{},(doc)=>{
               if(doc === null)
               {
                   var servicemod = this.loadmodel('service');
                   servicemod.addnew(this.req.postdata.jobname,(res)=>{console.log(res);});
                   console.log(doc);
                  usermod.addtoarray({_id:_id},temp,'jobs', (doca)=>
                 {
                     usermod.findOne({_id:_id}, {jobs:true},{},(docr)=>
                     {
                         doca.jobs = docr;
                         user.jsonResp(doca);
                     }
                     );
                 });  
               }
               else{
                   user.jsonResp({success:false, message:'Already exist'});
               }
                   
           });
    });
}

user.removetask = function()
{
  
    var usermod = this.loadmodel('user');
    var _id = usermod.createObjectId(this.req.postdata._id);
   console.log(parseInt(this.req.postdata.jobid));
    usermod.removefromarray({_id:_id},{jobs:{jobid:parseInt(this.req.postdata.jobid)}},false,(doc)=>
    {
        usermod.findOne({_id:_id}, {jobs:true},{},(docr)=>
        {
            resdoc={};
            resdoc.success=true;
            resdoc.jobs={};
            resdoc.jobs.jobs = docr.jobs;
            resdoc.jobs._id = docr._id;
            
            user.jsonResp(resdoc);
        });
        
        }
        );
}
user.fillSlot = function()
{
     var usermod = this.loadmodel('user');
    var totaldaymins = 0;
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var beginTime = this.req.postdata.begintime;
    var endTime = this.req.postdata.endtime;
    var schudleeName = this.req.postdata.name;
    var userid = this.req.postdata.email;
    var contactnumber = this.req.postdata.contactnumber;
    var email = this.req.postdata.email;
    var usemod = this.loadmodel('user');
    var _id = usermod.createObjectId(this.req.postdata._id);
    var seldate = new Date(this.req.postdata.date);
    var selectedday =  weekday[seldate.getDay()];
     usermod.findOne({_id:_id},{password:false, passwordr:false, images:false, profilethumb:false},{},(srvdoc)=>
     {
      var workday;
      var specialday = false;
      var opentime;
      var closetime;
      
      //the datetime for both sartreserv and close reserv
      var startresarray = beginTime.split(':');
      var closeresarray = closetime.split(':');
      var startReserv = new Date(this.req.postdata.date);
      startReserv.setHours(startresarray[0]);
      startReserv.setMinutes(startresarray[1]);
      var closeResrv = new Date(this.req.postdata.date);
      closeResrv.setHours(closeresarray[0]);
      closeResrv.setMinutes(closeresarray[1]);
      console.log(this.req.postdata);
      //calculate total opentime for the day 
      
      for(var oei=0; oei<srvdoc.opendaysexception.lenth; oei++) //check to see if date is same as a special opening day
      {
          var tdate = new Date(opendaysexception[i].specialdate);
          if(tdate === seldate)
          {
            specialday = true; 
            workday = srvdoc.opendaysexception[i]; 
            opentime=srvdoc.opendaysexception[i].specialopeninghour;
            closetime =srvdoc.opendaysexception[i].specialclosinghour;
            break; 
          }
      }
      if(specialday ===false) // if not then it is a normal opening day 
      {
      for(var openday in srvdoc.opendays)
      {
          if(srv.opendays[openday].day ===selectedday)
          {
            workday = srv.opendays[openday];
            opentime = srv.opendays[openday].opoentime;
            closetime = srv.opendays[openday].closetime;
            break;
          }
      }
      }
      var opentimearray = opentime.split(':');
      var closingtimearray = closetime.split(':');
      var opening = new Date(this.req.postdata.date);
      var closing = new Date(this.req.postdata.date);
      opening.setHours(opentimearray[0]);
      opening.setMinutes(opentimearray[1]);
      closing.setHours(closingtimearray[0]);
      closing.setMinutes(closingtimearray[1]);
      var dif = closing.getTime() - opening.getTime();
      var totaldaymins = (dif /60000);
      // we got the total nnumber mins we are opened for the day
      
      
     //  temp.push({begintime:beginTime, endtime:endTime, })
     
    closeResrv.setMinutes(closeResrv.getMinutes()+ srvdoc.workbreak);
    var temproster = [];
    var bt = startReserv.getTime()-opening.getTime(); 
    bt = bt/60000;
    var et = closeResrv.getTime() - opentime.getTime();
    et = et/60000;
            
   
    var closinginmins = (closing.getTime()-opening.getTime()) /60000;
    
    usermod.findOne({_id:_id, roster:{$elematch:{date:this.req.postdata.date}}},{_id:true},{},(rostid)=>
    {
        if(rostid ===null)
        {
             var nextAvailableTime = et;
            temproster.push({date:this.req.postdata.date,schedule:[{begintime:bt,endtime:et}],availabletimes:[{beginTime:nextAvailableTime, endtime:closinginmins,beginhour:beginTime,endhour:endTime}]}); 
            usermod.addtoarray({_id:_id}, temproster, 'roster',(resdoc)=>{user.jsonResp(resdoc)});
        }
        else{
            
            var scheduleLength = srvdoc.roster.schedule.length;
            var schedule = srvdoc.schedule;
                 var freetimeArr = [];
                 var tempsched = [];
                 tempsched ={begintime:bt,endtime:et}
                
                 usermod.removefromarray({_id:_id,'roster.date':this.req.postdata.date},{'roster.$.availabletimes':{begintime:bt}},true,(rmdoc)=>{
                     
                 usermod.addtoarray({_id:_id, 'roster.date':this.req.postdata.date}, tempsched, 'roster.$.schedule',(resdoc)=>{user.jsonResp(resdoc)});
                     
                 });
                 
                 for(var i=0; i<scheduleLength; i++)
                 {
                     if(i = scheduleLength-1)
                     {   
                         if(schedule[i].begintime <= srvdoc.workbreak)
                         {     var ft = et - closinginmins;
                               if(ft > srvdoc.freetime)
                                 freetimeArr.push({begintime:et,endtime:closinginmins});
                         }
                         else{
                             var endtimebefore = schedule[i].begintime - srvdoc.workbreak;
                             if(endtimebefore >srvdoc.workbreak)
                               freetimeArr.push({begintime:0,endtime:endtimebefore});
                             if((schedule[i].endtime - closinginmins) > srvdoc.workbreak)
                                freetimeArr.push({begintime:schedule[i].endtime, endtime:closinginmins});
                             
                         }
                     }
                     else{
                         
                         var freetime = schedule[i+1].begintime - schedule[i].endtime-srvdoc.workbreak;
                         if(freetime > srvdoc.workbreak)
                         {
                             var endfree = schedule[i+1].begintime;
                             freetimeArr.push({begintime:et,endtime:endfree, beginhour:beginTime,endhour:endTime});
                            
                         }
                     }
                 }
                 usermod.addtoarray({_id:_id, 'roster.date':this.req.postdata.date}, freetimeArr, 'roster.$.availabletimes',(resdoc)=>{user.jsonResp(resdoc)});
                 
            }
        
    }
    );
    usermod.addtoarray({_id:_id})
         
     });
    
}

user.getavailabletimes = function(servid)
{
    console.log(servid);
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var umod  =  this.loadmodel('user');
    var _id = umod.createObjectId(servid);
    var today = new Date();
   
   umod.findOne({_id:_id},{roster:true, opendays:true, opendaysexception:true,jobs:true,profilethumb:true, businessname:true},{},(doc)=>{
     
     //check if it is a special day if it is look to see it is a single opened interval else get the different opened intervals
       var dayisspecial = false;
       if(doc.opendaysexception !== undefined)
       {
       for(var de=0; de<doc.opendaysexception.length; de++)
       {
           var edate = new Date(doc.opendaysexception[de].specialdate);
           
           if(edate.toLocaleDateString() === today.toLocaleDateString())
           {
              dayisspecial = true;
              break;
           }
  
       }
       }
       
       var day;
       var daytoday = weekday[today.getDay()];
       if(! dayisspecial)
       {
       for(var d = 0; d < doc.opendays.length; d++)
       {
           if(doc.opendays[d].day === daytoday)
           {
               day = doc.opendays[d];
               break;
           }
       }
      
      var opentimearray = day.opentime.split(':');
      closetimearray = day.closetime.split(':');
      var opentime = new Date();
      var closetime = new Date();
      opentime.setHours(opentimearray[0]);
      opentime.setMinutes(opentimearray[1]);
      closetime.setHours(closetimearray[0]);
      closetime.setMinutes(closetimearray[1]);
      console.log(day);
      var minnsforday = (closetime.getTime()-opentime.getTime()) / 60000;
      if(doc.availabletimes === undefined)
      {
         var jobarr =[];
          doc.availabletimes=[{begintime:0, endtime:minnsforday, beginhour:day.opentime,endhour:day.closetime}];
      if(doc.jobs !== undefined)
      {
          for(var job=0; job<doc.jobs.length; job++)
          {
              if(doc.jobs[job].jobduration <= minnsforday)
                jobarr.push(doc.jobs[job]);
           }
      }
      
       user.jsonResp({availabletimes:doc.availabletimes, profilethumb:doc.profilethumb,
           services:jobarr,opentime:day.opentime, closetime:day.closetime,dayisspecial:false,
       businessname:doc.businessname   
    }); 
      }
     }//end of normal day logic
   });
},
user.getimageandads = function(id)
{
    var umod = this.loadmodel('user');
    var _id= umod.createObjectId(id);
    console.log(_id);
    umod.findOne({_id:_id},{images:{$slice:5},_id:true},{},(doc)=>{
        this.jsonResp(doc);
    });
},
user.businesspage = function(id)
{
    this.viewholder.businessid = id;
    this.loadview('businesspage');
    
}

module.exports = user;