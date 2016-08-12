var simple = require('simple');
 var async = require('async');
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
    usermod.generateNextSequence('specialdayid',(oid)=>{
        
        this.req.postdata.specialdayid =parseInt(oid);
         temp.push(this.req.postdata);
          usermod.findOne({$or:[{_id:_id,'opendaysexception.specialdate':this.req.postdata.specialdate, 'opendaysexception.specialopeninghour':this.req.postdata.specialopeninghour},{'opendaysexception.specialdate':this.req.postdata.specialdate, 'opendaysexception.closed':"true"}]}
          ,{_id:true},{},(sdoc)=>
          {
              console.log(sdoc, 'test');
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
    console.log('sent');
}

user.search = function()
{
    var usermod =this.loadmodel('user');
    ///console.log(this.req.postdata,'pp');
     var regex = new RegExp(this.req.postdata.searchtext,'i'); 
      if(this.req.postdata.searchtype === 'service')
    usermod.find({'jobs.jobname':{$regex:regex}},{password:false,passwordr:false},{},true,(doc)=>{user.jsonResp(doc);});
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
                   
                 usermod.addtoarray({_id:_id},temp,'jobs', (doca)=>
                 {
                     
                     usermod.findOne({_id:_id}, {jobs:true},{},(docr)=>
                     {
                         
                         docr.jobs.sort((a,b)=>{return a.jobduration-b.jobduration});
                         console.log(docr.jobs);
                         usermod.saveUser(_id,{smalestjob:docr.jobs[0].jobduration},(doc)=>{console.log('it save',_id)})
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
    console.log(this.req.postdata);
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
    var beginhour = this.req.postdata.starthour;
    var endhour = this.req.postdata.endhour;
    var begintimemin = this.req.postdata.beginTime;
    var endtimemin =  this.req.postdata.endTime;
    var schudleeName = this.req.postdata.name;
    var userid = this.req.postdata.email;
    var contactnumber = this.req.postdata.contactnumber;
    var email = this.req.postdata.email;
    var usemod = this.loadmodel('user');
    var _id = usermod.createObjectId(this.req.postdata._id);
     var ad= this.req.postdata.date.split('-');
  
    var seldate = new Date(parseInt(ad[0]),parseInt(ad[1])-1,parseInt(ad[2]));
    
  
    var selectedday =  weekday[seldate.getDay()];
     usermod.findOne({_id:_id},{password:false, passwordr:false, images:false, profilethumb:false},{},(srvdoc)=>
     {
         
      console.log(beginhour, endhour, 'toto');
      var workday;
      var specialday = false;
      var spdayobject;
      var opentime;
      var closetime;
      var workbreak = srvdoc.workbreak;
      //the datetime for both sartreserv and close reserv
      var startresarray = beginhour.split(':');
      var closeresarray = endhour.split(':');
      var startReserv = new Date(seldate.getTime());
      startReserv.setHours(parseInt(startresarray[0]));
      startReserv.setMinutes(parseInt(startresarray[1]));
      var closeResrv = new Date(seldate.getTime());
      closeResrv.setHours(parseInt(closeresarray[0]));
      closeResrv.setMinutes(parseInt(closeresarray[1]));
     // var seldate = this.req.postdata.date;
      //calculate total opentime for the day 
       var currspday =[]; 
       var untouched=[];
       var spopening;
       var spclosing;
      if(srvdoc.opendaysexception !== undefined)
      {
     
      var spobj;
      for(var oei=0; oei<srvdoc.opendaysexception.length; oei++) 
      {
        
          var openhrar =  srvdoc.opendaysexception[oei].specialopeninghour.split(':'); 
          var closehar =   srvdoc.opendaysexception[oei].specialclosinghour.split(':');
          var spdatear = srvdoc.opendaysexception[oei].specialdate.split('-');
          var month = parseInt(spdatear[1])-1;
          var year = parseInt(spdatear[0]);
          var day = parseInt(spdatear[2]);
          var tdate = new Date(year,month,day);
          var closedate = new Date(tdate.getTime());
          closedate.setHours(parseInt(closehar[0]));
          closedate.setMinutes(parseInt(closehar[1]));
          tdate.setHours(parseInt(openhrar[0]));
          
          
          tdate.setMinutes(parseInt(openhrar[1]));
          var totalmins = (closedate.getTime()-tdate.getTime())/60000;
         if(tdate.toLocaleDateString() === seldate.toLocaleDateString())
         {
          var cday= {opentime:srvdoc.opendaysexception[oei].specialopeninghour, closetime:srvdoc.opendaysexception[oei].specialclosinghour, endtime:totalmins, opening:tdate, closing:closedate};
        
           currspday.push(cday);
          
          if((startReserv.getTime() > tdate.getTime() && startReserv.getTime() <closedate.getTime()))
          {
              /*if(currspday === undefined) 
              {
                currspday =tdate;
                spobj=srvdoc.opendaysexception[oei];
              }
              else
              {
                  if(tdate.getTime() < currspday.getTime())
                  {
                    currspday = tdate;
                    spobj = srvdoc.opendaysexception[oei]
                  }
              }*/
              
            specialday = true; 
            workday = cday;
            spopening = tdate;
            spclosing = closedate;
            
           // spdayobject = opendaysexception[i];
          
          }
          else{
             
              untouched.push({beginhour:srvdoc.opendaysexception[oei].specialopeninghour, endhour:srvdoc.opendaysexception[oei].specialclosinghour, endtime:totalmins, begintime:0,closing:closedate})
          }
         }
      }
      if(specialday)
      {
      currspday.sort((a,b)=>{return a.opening-b.opening});
      opentime=currspday[0].opentime;
      closetime =currspday[currspday.length-1].closetime;
      }
      
    
     
     
      }
        
        
      if(specialday ===false) // if not then it is a normal opening day 
      {
      
      for(var openday in srvdoc.opendays)
      {  
          if(srvdoc.opendays[openday].day ===selectedday)
          {
           
            workday = srvdoc.opendays[openday];
            opentime = srvdoc.opendays[openday].opentime;
            closetime = srvdoc.opendays[openday].closetime;
            break;
          }
      }
      }
      
     
      var opentimearray = opentime.split(':');
      var closingtimearray = closetime.split(':'); 
      
      
      var opening = new Date(seldate.getTime());
      var closing = new Date(seldate.getTime());
     
      opening.setHours(opentimearray[0]);
      opening.setMinutes(opentimearray[1]); 
      closing.setHours(closingtimearray[0]); 
      closing.setMinutes(closingtimearray[1]);
      
      var dif = closing.getTime() - opening.getTime();
      
      var totaldaymins = (dif /60000);
      
      // we got the total nnumber mins we are opened for the day
    
     //  temp.push({begintime:beginTime, endtime:endTime, })
     closeResrv = new Date(closeResrv.getTime()+ workbreak*60000);
    console.log(closeResrv.getTime(), opening.getTime(), opentime,closetime, beginhour, endhour, 'lplpl');
   
    //closeResrv.setMinutes(closeResrv.getMinutes()+ srvdoc.workbreak);
    var temproster = [];
    var bt = parseInt(startReserv.getTime()-opening.getTime()); 
    bt = bt/60000;
    var et = parseInt(closeResrv.getTime() - opening.getTime());
   // if(specialday)
     // et = parseInt(closeResrv.getTime() - spopening.getTime());
    et = et/60000;
            
    var tempch = closeResrv.getHours();
    
    var tempcm = closeResrv.getMinutes();
    if(tempch <10) tempch ="0"+tempch;
    if(tempcm <10) tempcm ="0"+tempcm; 
    endhour = tempch+":"+tempcm;
   console.log(endhour,'testhrend');
    var closinginmins = parseInt((closing.getTime()-opening.getTime()) /60000);
    
    
    usermod.findOne({_id:_id, roster:{$elemMatch:{date:this.req.postdata.date}}},{_id:true, roster: { $elemMatch: { date: this.req.postdata.date }}},{},(rostid)=>
    {
        
        var mintime = parseInt(srvdoc.smalestjob) + parseInt(workbreak);
       
        if(rostid ===null)
        {
            var endfreetime = '';
            var startfreetime = '';
            var atimes = [];
            var nextAvailableTime = et;
            var clt = totaldaymins;
            if(specialday)
               clt = (spclosing - opening) /60000;
             if(bt >mintime) 
             {
                 var ndd = new Date(startReserv.getTime() - workbreak*60000);
                 var efth = ndd.getHours();
                 var eftm = ndd.getMinutes();
                 if(efth < 10) efth = "0"+efth;
                 if(eftm <10) eftm = "0"+eftm;
                endfreetime = efth+':'+eftm;
                
                var rbt = 0;
                var rct = closinginmins;
                if(specialday)
                {
                  rbt = (workday.opening - opening)/60000;
                  rct = (workday.closing - opening)/60000; 
                }
                  
                
                 
                //logic for spdayobject
                //*** to come here
                 atimes.push({begintime:rbt, endtime:bt-workbreak ,beginhour:workday.opentime, endhour:endfreetime});
                
            /*    var sfth = startReserv.getHours();
                 var sftm = startReserv.getMinutes();
                 if(sfth < 10) sfth = "0"+sfth;
                 if(sftm <10) sftm = "0"+sftm;
                
                startfreetime = sfth+':'+sftm;*/
                atimes.push({begintime:nextAvailableTime, endtime:rct, beginhour:endhour, endhour:workday.closetime});
               
             }
             else
             {   
                 atimes.push({begintime:nextAvailableTime, endtime:clt,beginhour:endhour,endhour:workday.closetime});
             }
             
            if(specialday)
            {
                for(var un =0; un<untouched.length; un ++)
                {
                    var ubopar = untouched[un].beginhour.split(':');
                    var unbt = new Date(seldate.getTime());
                    unbt.setHours(parseInt(ubopar[0]));
                    unbt.setMinutes(parseInt(ubopar[1]));
                    var tp = unbt - opening;
                    untouched[un].begintime = tp / 60000;
                    untouched[un].endtime = (untouched[un].closing -opening) /60000
                    delete untouched[un].closing;
                    atimes.push(untouched[un]);
                }
               
            }
            temproster.push({date:this.req.postdata.date,schedule:[{begintime:bt,endtime:et,beginhour:beginhour,endhour:endhour}],availabletimes:atimes}); 
        
          
           
          
            
            usermod.addtoarray({_id:_id}, temproster, 'roster',(resdoc)=>{user.jsonResp(resdoc)});
        }
        else{
            var freetimeArr = [];
                 var tempsched = [];
                 var spsched = [];
                 tempsched.push({begintime:bt,endtime:et,beginhour:beginhour,endhour:endhour});
              
             
             var schedArrMem = rostid.roster[0].schedule;
             // i think i shoud just follow nirmal day logic
             schedArrMem.push(tempsched[0]);
            
             console.log(tempsched, 'new schedul');
           var spuntouched = [];

           if(specialday)
           {
             
              
             
             
             if(rostid.roster[0].availabletimes !== undefined)
              {
               for(var rat =0 ;rat< rostid.roster[0].availabletimes.length; rat++) 
               {
                   var objtime = new Date(seldate.getTime());
                   var objshr = rostid.roster[0].availabletimes[rat].beginhour.split(':');
                   
                   objtime.setHours(parseInt(objshr[0]));
                   objtime.setMinutes(parseInt(objshr[01]));
                   
                  
                   if(objtime >spclosing || objtime < spopening) 
                   {
                     
                     spuntouched.push(rostid.roster[0].availabletimes[rat]);
                   }
                   
                    
               }
              }
               
              if(rostid.roster[0].schedule !== undefined)
              {
                
               for(var bat =0 ;bat< rostid.roster[0].schedule.length; bat++) 
               {
                   var objtime = new Date(seldate.getTime());
                   var objshr = rostid.roster[0].schedule[bat].beginhour.split(':');
                   
                   objtime.setHours(parseInt(objshr[0]));
                   objtime.setMinutes(parseInt(objshr[01]));
                   
                  
                   if(objtime < spclosing && objtime >= spopening) 
                   {
                     
                     spsched.push(rostid.roster[0].schedule[bat]);
                   }
                   
                    
               }
              }      
           }
            if(specialday)
                schedArrMem = spsched;
            schedArrMem.sort((a,b)=>{return a.begintime - b.begintime});
          console.log(schedArrMem,'kkkspch');
          
                
            var scheduleLength = schedArrMem.length; 
            var schedule = schedArrMem;
                 
                var atsort = rostid.roster[0].availabletimes.sort((a,b)=>{return a.begintime - b.begintime});
                // usermod.removefromarray({_id:_id,'roster.date':this.req.postdata.date},{'roster.$.availabletimes':{beginhour:this.req.postdata.slottodel}},true,(rmdoc)=>{
                 usermod.findAndUpdate({_id:_id, 'roster.date':this.req.postdata.date},{'roster.$.availabletimes':[]},(rmdoc)=>{
                 usermod.addtoarray({_id:_id, 'roster.date':this.req.postdata.date}, tempsched, 'roster.$.schedule',(resdoc)=>{
               
                     
                 for(var i=0; i<scheduleLength; i++)
                 {
                    
                   /*  var sh= schedule[i].beginhour.split();
                     var eh = schedule[i].endhour.split();
                     var resvrs = new Date();
                     resvrs.setHours(sh[0]);
                     resvrs.setMinutes(sh[1]);
                     var resvre =  new Date();
                     resvre.setHours(eh[0]);
                     resvre.setMinutes(eh[1]);*/
                   
                     //add a condition for when first one to calculate time before and after.
                       
                     if(i == 0)
                     {
                         var btime = 0;
                         var bhr = opentime;
                         console.log(mintime);
                         var firstresv = schedule[0];
                         var fbt =  firstresv.begintime;
                         if(specialday)
                         {
                             var begintimeday = new Date(spopening.getTime()+ firstresv.begintime * 60000);
                             fbt = (begintimeday - spopening) / 60000;
                             console.log(fbt,'fbter');
                             btime =  (spopening-currspday[0].opening)/60000;
                             bhr = workday.opentime;
                         }
                         
                        
                         if(fbt> mintime) // subtract interval start time
                         {
                           
                             var endtbefore = firstresv.begintime-workbreak;
                             var enddt = new Date(opening.getTime()+(endtbefore*60000));
                             var endhour  = enddt.getHours();
                             if(endhour <10)
                              endhour = "0"+endhour;
                            var endmin = enddt.getMinutes();
                            if(endmin <10)
                              endmin = "0"+endmin;
                           
                             if(isWithinAvail(atsort,btime))
                              freetimeArr.push({begintime:btime, endtime:endtbefore,beginhour:bhr,endhour:endhour+':'+endmin });
                         }
                     }
                     if(i === scheduleLength-1)
                     {  
                        
                      /*   if(schedule[i].begintime <= srvdoc.smalestjob+workbreak)
                         {     var ft = et - closinginmins;
                              
                               if(ft > srvdoc.smalestjob+workbreak)
                                 freetimeArr.push({begintime:et,endtime:closinginmins, beginhour:endhour, endhour:closetime});
                         }
                         else{
                             var endtimebefore = schedule[i].begintime;
                                                         
                            if(endtimebefore >srvdoc.smalestjob+workbreak && scheduleLength ===1)
                               freetimeArr.push({begintime:0,endtime:endtimebefore, beginhour:opentime, endhour:schedule[i].beginhour});
                               */
                             var ct= closetime;
                             var cm  = closinginmins;
                             if(specialday)
                             {
                              ct = workday.closetime;
                              cm = (workday.closing.getTime() - opening.getTime())/60000;
                             }
                             if((cm-schedule[i].endtime) > mintime && isWithinAvail(atsort,schedule[i].endtime))
                             {
                                 console.log('hihi');
                                freetimeArr.push({begintime:schedule[i].endtime, endtime:cm,beginhour:schedule[i].endhour, endhour:ct});
                             }
                             
                         //}
                     }
                     else{
                         
                         var freetime = schedule[i+1].begintime - schedule[i].endtime-srvdoc.workbreak;
                         if(freetime > mintime)
                         {
                             var opt = (spopening - opening)/60000;
                             var clt = (spclosing - opening) /60000;
                             var endfree = schedule[i+1].begintime;
                             console.log(schedule[i].begintime, opt,clt,schedule[i].endtime, 'ssssss');
                             if((!specialday || (specialday && (schedule[i].begintime >= opt && schedule[i].endtime <=clt))) && isWithinAvail(atsort,schedule[i].endtime))
                                  freetimeArr.push({begintime:schedule[i].endtime,endtime:endfree, beginhour:schedule[i].endhour,endhour:schedule[i+1].beginhour});
                           
                         }
                     }
                 }
                 
                // console.log(before,'pp');
                 for(var un=0; un < spuntouched.length; un++)
                 {
                     freetimeArr.push(spuntouched[un]);
                 }
                   freetimeArr.sort((a,b)=>{return a.begintime-b.begintime});
                   console.log(freetimeArr,'pp');
              
                 // usermod.findAndUpdate({_id:_id, 'roster.date':this.req.postdata.date},{'roster.$.availabletimes':freetimeArr},(resdoc)=>{user.jsonResp(resdoc)});
                 usermod.addtoarray({_id:_id, 'roster.date':this.req.postdata.date}, freetimeArr, 'roster.$.availabletimes',(resdoc)=>{
                     resdoc.availabletimes = freetimeArr;
                     user.jsonResp(resdoc)});
                 });
                     
                 });
                
                 
            }
        
    }
    );
   // usermod.addtoarray({_id:_id})
         
     });
    
}

user.getavailabletimes = function(servid,date)
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
    var dayOpenTimes=[];
    var seldatearr = date.split('-');
    var selecteddate = new Date(parseInt(seldatearr[0]),parseInt(seldatearr[1])-1, parseInt(seldatearr[2]),today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds());
    
 
   if(selecteddate < today)
   {
       user.jsonResp({success:false, message:'The dat selected is not valid'});
   }
   else{
       
  
   umod.findOne({_id:_id},{roster: { $elemMatch: { date: date }}, opendays:true, daysahead:true, opendaysexception:true,jobs:true,profilethumb:true,  businessname:true},{},(doc)=>{
      console.log(doc.roster);
     //check if it is a special day if it is look to see it is a single opened interval else get the different opened intervals
       var dayisspecial = false;
       var specialday = [];
       var datedif = ((selecteddate-today) / 3600000)/24;
      if(datedif <= parseInt(doc.daysahead))
      {
      if(doc.opendaysexception !== undefined)
       {
        
       for(var de=0; de<doc.opendaysexception.length; de++)
       {
            var spdatear = doc.opendaysexception[de].specialdate.split('-');
           var edate = new Date(parseInt(spdatear[0]), parseInt(spdatear[1])-1,parseInt(spdatear[2]));
           console.log(edate.toLocaleDateString())
           if(edate.toLocaleDateString() === selecteddate.toLocaleDateString())
           {
               var openharr = doc.opendaysexception[de].specialopeninghour.split(':');
               var closehharr = doc.opendaysexception[de].specialclosinghour.split(':');
               var closedate = new Date(edate.getTime());
               edate.setHours(parseInt(openharr[0]));
               edate.setMinutes(parseInt(openharr[1]));
               closedate.setHours(parseInt(closehharr[0]));
               closedate.setMinutes(parseInt(closehharr[1]));
               var spct = (closedate-edate) / 60000;
              dayisspecial = true;
              doc.opendaysexception[de].endtime = spct;
               doc.opendaysexception[de].slotopentime = edate;
              
              specialday.push(doc.opendaysexception[de]);
              dayOpenTimes.push({open:doc.opendaysexception[de].specialopeninghour, close:doc.opendaysexception[de].specialclosinghour});
              //break;
             
             
           }
  
       }
        console.log(dayisspecial);
       }
       
       var day;
       var closed = false;
       var daytoday = weekday[selecteddate.getDay()];
        var availableforday = [];
        
      // if(! dayisspecial)
      // {
       for(var d = 0; d < doc.opendays.length; d++)
       {
         
            if(doc.opendays[d].day === daytoday && doc.opendays[d].closed ==="true")
             closed = true;
           if(doc.opendays[d].day === daytoday && doc.opendays[d].closed ==="false")
           {
               
               day = doc.opendays[d];
               console.log(day); 
               break;
           }
           
          
            
       }
       
      
     if(!closed)
     { 
      if(!dayisspecial)
       dayOpenTimes.push({open:day.opentime, close:day.closetime});
      var opentimearray = day.opentime.split(':');
      closetimearray = day.closetime.split(':');
      var opentime = new Date();
      var closetime = new Date();
      opentime.setHours(opentimearray[0]);
      opentime.setMinutes(opentimearray[1]);
      closetime.setHours(closetimearray[0]);
      closetime.setMinutes(closetimearray[1]);
    
    
      dayOpenTimes.sort((a,b)=>{return a.open-b.open});
      var doorOpener = dayOpenTimes[0];
      var smallestot = new Date(selecteddate.getTime());
      var sopar = doorOpener.open.split(':');
      console.log(sopar);
      smallestot.setHours(parseInt(sopar[0]));
      smallestot.setMinutes(parseInt(sopar[1])); 
      smallestot.setSeconds(0);
      smallestot.setMilliseconds(0);
      var minnsforday = (closetime.getTime()-opentime.getTime()) / 60000;
      var jobarr =[];
     
      
      if(doc.roster === undefined || (doc.roster !== undefined && (doc.roster[0] === undefined ||doc.roster[0].availabletimes === undefined || doc.roster[0].availabletimes.length ===0)))
      {
        
         if(dayisspecial)
         {
             for(var sd=0; sd < specialday.length; sd++)
             {
                 var spbt = (specialday[sd].slotopentime-smallestot)/60000;
                 console.log(spbt,  specialday[sd].endtime);
                 availableforday.push({beginhour:specialday[sd].specialopeninghour, endhour:specialday[sd].specialclosinghour, begintime:spbt, endtime:specialday[sd].endtime+spbt});
                 
             }
             availableforday.sort((a,b)=>{return a.beginhour-b.beginhour})
             console.log(availableforday, 'jojojo');
         }
         else{
         availableforday=[{begintime:0, endtime:minnsforday, beginhour:day.opentime,endhour:day.closetime}];
         }
      }
      else
      {
          
          for(var ad =0;ad<doc.roster.length;ad++)
          {
                
              if(doc.roster[ad].date === date)
              {
                
                  availableforday = doc.roster[ad].availabletimes;
                  break;
              }
             
          }
          console.log(availableforday, 'please');
          if(availableforday.length ===0 && day !== undefined)
              availableforday=[{begintime:0, endtime:minnsforday, beginhour:day.opentime,endhour:day.closetime}];
              
      }
      if(doc.jobs !== undefined)
      {
          for(var job=0; job<doc.jobs.length; job++)
          {
              if(doc.jobs[job].jobduration <= minnsforday)
                jobarr.push(doc.jobs[job]);
           }
      }
      
      var doorCloser = dayOpenTimes.length >1 ? dayOpenTimes[dayOpenTimes.length -1] : dayOpenTimes[0];
     
       user.jsonResp({availabletimes:availableforday, profilethumb:doc.profilethumb,
           services:jobarr,opentimes:dayOpenTimes,dayisspecial:dayisspecial,
       businessname:doc.businessname, dooropener:doorOpener.open, doorcloser:doorCloser.close
    }); 
      
    /*  }
      else{
          //special day logic;
        console.log(specialday);
         user.jsonResp({availabletimes:availableforday, profilethumb:doc.profilethumb,
           services:jobarr,opentime:day.opentime, closetime:day.closetime,dayisspecial:false,
       businessname:doc.businessname } );    
      } */
       //end of normal day logic
     }
     else
     {
          user.jsonResp({success:false, message:'closed for the day'});
     }
     }
     else
     {
         user.jsonResp({success:false, message:'You have selected a date past the available days'});
     }
     
    
   });
   
   }
}
user.getimageandads = function(id)
{
    console.log('requested');
    var umod = this.loadmodel('user');
    var _id= umod.createObjectId(id);
   
    umod.findOne({_id:_id},{images:{$slice:5},_id:true},{},(doc)=>{
       
        async.map(doc.images, (image, callback)=>
        {
            var bits='';
             umod.streamfromgrid(image.gridid,(chnk, end,closed)=>{
                 
                 if(end === false)
                  {
                   bits +=chnk;
                  }
                  else
                {
                  console.log('l');
                   image.image=bits;
                   callback(null, 'success');
                 }
                 
                
             });
        },
        (err, res)=>
        {
            console.log('finiti');
             this.jsonResp(doc);
        }
        );
       
        
       
    });
}
user.businesspage = function(id)
{
    this.viewholder.businessid = id;
    this.loadview('businesspage');
    
}

function isWithinAvail(arr, startt)
{
   console.log(startt, arr, 'patat');
    var start = 0;
    var end = arr.length;
    
   while(start <= end)
    {
       
         var mid = Math.floor((start + end) / 2);
          console.log(start,mid,end); 
         if(startt >= arr[mid].begintime && startt <= arr[mid].endtime)
         {
             console.log('yay i found it');
             return true;
         }
       
        if(startt >= arr[mid].begintime)
        {
          start = mid+1;
          console.log('more');
        }
        else{
            console.log('less');
            end=mid-1;
        }
    }
    console.log('oh no you did not');
    return false;
}

module.exports = user;