var days=[{day:'Sunday'},{day:'Monday'},{day:'Tuesday'},{day:'Wednesday'}, {day:'Thursday'}, {day:'Friday'}, {day:'Saturday'}];
   var BProfilePage = React.createClass({
    getInitialState:function(){
        
        return({contactname:'',selectedpadthumb:'/image/photo.png', selectedpad:'', businessname:'',password:'', passwordr:'',
        profilethumb:'/image/lady.png', country:'US',part:'BI', street:'',dateformed:'',mainemail:'',zip:'', mediatype:'photo',
        backupemail:'',town:'',contactnumber:'', error:'',mobilelist:[], servicename:'', mapmarkers:[], latlang:'', markers:[],townlist:[],
        closed:false,specialclosinghour:'',specialopeninghour:"", specialdate:'', opendays:days, opendaysexception:[], businesstype:[],images:[],workbreak:'',
        jobduration:'', jobname:'',services:[],jobs:[]
    });
    },
    
   handleListClickBI:function(e)
   {
     
       this.setState({part:'BI'});
   },
   handleListClickBA:function(e)
   {
     
       this.setState({part:'BA'});
   },
   handleListClickServices:function(e)
   {
     
       this.setState({part:'SRV'});
   },
   handleListClickEmail:function(e)
   {
     this.setState({part:'EP'});  
   },
   componentDidMount:function(){
       if(this.myTextInput !== undefined)
         console.log(this.myTextInput,'pp');
        this.serverRequest = $.get(this.props.data.source, function(success)
        {
          
          this.setState(success);
          console.log(this.state);
            
            
        }.bind(this));
       
    },
    componentWillUnmount:function()
    {
        this.serverRequest.abort();
    },
   handleClickPhone:function()
   {
     document.getElementById('ph').style.maxHeight = '600px';  
   },
   handleListClickAds:function()
   {
       this.setState({part:'PAD'});
   },
   handleInputChange:function(e)
   {
       name =e.target.name;
       var userobj ={}
       userobj[name]=e.target.value;
      console.log(userobj);
      this.setState(userobj) ; 
   },
   handlBtwnChange:function(e)
   {
     this.setState({businesstwn:e.target.value}) ;
   },
   zipChange:function()
   {
       
   },
   handleSubmitCountry:function(e)
   { var mp = this;
       e.preventDefault();
       var addrObject = {country:this.state.country, street:this.state.street, businesstwn:this.state.businesstwn, zip:this.state.zip,_id:this.state._id}
       console.log(addrObject);
       $.ajax({
           method:'POST',
           dataType:'json',
           url:'/user/updateuser/',
           data:addrObject,
           beforeSend:function()
           {
            startSpinner();   
           },
           success:function(res)
           {
               mp.setState(res);
               stopSpinner();
               if(res.success !==false)
                 showToast('Changes saved');
           }
       });
   },
   handleInfoSubmit:function(e)
   {
       var mp = this;
       e.preventDefault();
     var infoobj = {businessname:this.state.businessname, contactname:this.state.contactname, dateformed:this.state.dateformed, servicename:this.state.servicename,_id:this.state._id}
     $.ajax({
         url:'/user/updateuser',
         method:'POST',
         dataType:'json',
         data:infoobj,
         beforeSend:function()
         {
           startSpinner();  
         },
         success:function(res)
         {
           stopSpinner();
           if(res.success !== false)
           {
               mp.setState(res);
               showToast('Business info saved');
           }
            
         }
     });  
   },
   handleTextDDChange:function(e)
        {   var ob = this;
            console.log(e.target.value, typeof e.target.value);
            this.setState({town:e.target.value});
            $.ajax({
                url:'/towns/regxpfind/'+e.target.value,
               
                success:function(res)
                {
                   
                     console.log(res);
                     ob.setState({townlist:res});
                    /* if(res.length >0)
                      document.getElementById('tlist').style.display='block';
                     else
                       document.getElementById('tlist').style.display='none';*/
                     
                }
            });
           // if(e.target.value===''|| typeof e.target.value !== 'string')
             //  document.getElementById('tlist').style.display='none';
        },
    handleImageChange:function(e)
    {
        
        var cur =this;
        var image = e.target.files[0];
        var fname = e.target.files[0].name;
        var canvas = document.getElementById('canv');
        var fr = new FileReader();
        fr.readAsDataURL(image);
        fr.onloadend = function(res)
        {
           var img = document.getElementById('pimg');
            img.src = fr.result;
            img.onload = function(res)
            {
                console.log(img.width, img.height);
                canvas.width = img.width;      // set canvas size big enough for the image
                canvas.height = img.height;
                
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img,0,0,img.width,img.height);
                
                document.getElementById('ppic').src = canvas.toDataURL();
                cur.setState({profilethumb :canvas.toDataURL()}); 
                
                var invimg = document.getElementById('invimg');
                invimg.src = fr.result;
               
                invimg.onload = function(er)
                {
                 
                var canvaslarge=document.createElement('CANVAS');
                canvaslarge.width=invimg.width;
                canvaslarge.height = invimg.height;
                var ctxlarge = canvaslarge.getContext("2d");
                ctxlarge.drawImage(invimg,0,0,invimg.width,invimg.height);
                console.log(invimg.height,'hgh');
                var durl =canvaslarge.toDataURL();
              
                
                var imageobject = cur.processDataurl(durl);
                 imageobject.filename = fname;
               
                cur.imgbtn.disabled=false;
                cur.setState({profilepiclarge:imageobject});
                }
               
            }
            
            
        }  
    },
    handleListClickRules:function(e)
    {
        this.setState({part:'RULES'});
    },    
   handlePADChange:function(e)
    {
        
        var cur =this;
        var image = e.target.files[0];
        var fname = e.target.files[0].name;
        var canvas = document.getElementById('canvpad');
        var fr = new FileReader();
        fr.readAsDataURL(image);
        fr.onloadend = function(res)
        {
           var img = document.getElementById('padimg');
            img.src = fr.result;
            img.onload = function(res)
            {
                console.log(img.width, img.height);
                canvas.width = img.width;      // set canvas size big enough for the image
                canvas.height = img.height;
                
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img,0,0,img.width,img.height);
                
                document.getElementById('padpic').src = canvas.toDataURL();
                cur.setState({selectedpadthumb :canvas.toDataURL()}); 
                
                var invimg = document.getElementById('invimgpad');
                invimg.src = fr.result;
               
                invimg.onload = function(er)
                {
                 
                var canvaslarge=document.createElement('CANVAS');
                canvaslarge.width=invimg.width;
                canvaslarge.height = invimg.height;
                var ctxlarge = canvaslarge.getContext("2d");
                ctxlarge.drawImage(invimg,0,0,invimg.width,invimg.height);
                var durl =canvaslarge.toDataURL();
              
                
                var imageobject = cur.processDataurl(durl);
                 imageobject.filename = fname;
                console.log(imageobject, 'joj');
                
                cur.setState({selectedpad:imageobject});
                }
               
            }
            
            
        }  
    },
    processDataurl:function(dataurl)
    {
        var splt = dataurl.split(':');
        var parts = splt[1].split(',');
        return {type:parts[0], data:parts[1]};
    },
     handleSubmitImage:function(e)
    {
        var mp = this;
        e.preventDefault();
      var idata={largeimage:this.state.profilepiclarge, profilethumb:this.state.profilethumb,_id:this.state._id}
     
      $.ajax({
          url:'/user/saveprofileimage',
          dataType:'json',
          type:'POST',
          data:JSON.stringify(idata),
          beforeSend:function()
          {
              startSpinner();
          },
          success:function(res)
          {
              
              stopSpinner();
              if(res.success !== false)
              {
                 mp.setState(res);
                 showToast('Image saved');
              }
          }
      });
    },
    handlePhoneSubmit:function(e)
    {var mp=this;
        e.preventDefault();
       $.ajax({
           url:'/user/savemobile',
           method:'POST',
           dataType:'json',
           data:{tel:this.state.mobile, _id:this.state._id},
           beforeSend:function()
          {
              startSpinner();
          },
           success:function(res)
           {
              stopSpinner();
              if(res.success === true)
              { console.log(res);   
                 mp.setState(res.mobile);
                   mp.MOBILEFORM.reset();
                 showToast('Mobile phone saved');
              }
           }
       }); 
    },
    handleEmailPassSubmit:function(e)
    {   e.preventDefault();
        var mp=this;
         var data = {mainemail:this.state.mainemail,backupemail:this.state.backupemail,_id:this.state._id}  
         if(this.state.passsword !== '' && this.state.passwordr !== '')
         {
          if(this.state.password === this.state.passwordr)
          {
            data.password =this.state.password; data.passwordr = this.state.passwordr;
          }
          else
          {
              this.state.error = 'Passwords do not match';
          }
         }
         console.log(data);
          $.ajax(
            {
            beforeSend:function(){startSpinner()},
            url:'/user/updateuser',
            dataType:'json',
            type:'POST',
            data:data,
            success:function(res)
            {
                
                stopSpinner();
                if(res.success !== false)
                {
                 mp.setState(res);
                 showToast('Your changes have been saved');
                }
                
                console.log(res);
            }
            }
        );
        
    },
    handlepPADSubmit:function(e)
    {
        var mp=this;
        e.preventDefault();
        if(this.state.selectedpad !=='')
        {
        var photoobj = {imagethumb: this.state.selectedpadthumb, image:this.state.selectedpad,_id:this.state._id,mediatype:this.state.mediatype}
        var data = JSON.stringify(photoobj);
        $.ajax({
           beforeSend:function()
           {
               startSpinner();
           },
           url:'/user/saveadorphoto',
            dataType:'json',
            type:'POST',
            data:data,
            success:function(res)
            {
                stopSpinner();
                if(res.success == true)
                {   
                    mp.setState(res.imagedata);
                    showToast('Photo Saved');
                }
            }
        });
        }
        else{
            alert('please chose a photo');
        }
    },
    handlePhotoClick:function(e)
    {
       
    },
    handleClosedChanged:function(e)
    {
         this.setState({closed:e.target.checked});
    },
    saveSpecialDayInfo:function(e)
    {
         e.preventDefault();
        if((this.state.specialdate!==''&&this.state.specialclosinghour !='' && this.state.specialopeninghour !=='')|| (this.state.specialdate !=='' && this.state.closed===true))
        {
        
        var specialday = {specialdate:this.state.specialdate, specialopeninghour:this.state.specialopeninghour,_id:this.state._id, specialclosinghour:this.state.specialclosinghour, closed:this.state.closed}
        if(this.state.closed === true)
        {
          specialday.specialclosinghour='00:00:00';
          specialday.specialopeninghour='00:00:00';  
        }
        var mp=this;
        $.ajax({
            url :"/user/savespecialhours",
            method:'POST',
            dataType:'json',
            data:specialday,
            beforeSend:function()
            {
                
                 document.getElementById('spinner').style.display='block';
                 document.getElementById('spinner').active=true;
               
                
            },
  
            success:function(res)
            {
                console.log(res);
                document.getElementById('spinner').active=false;
                document.getElementById('spinner').style.display='none';
               
               if(res.success === true)
               {
                   mp.setState(res.opendaysexception);
                    document.getElementById('toast').innerHTML="Your changes are saved";
                   
                   document.getElementById('toast').open();
               }
               else
               {
                   document.getElementById('toast').innerHTML=res.message;
                   document.getElementById('toast').open();
               }
               
            }
        });
        }else
        {
            alert('please fill all fields')
        }
        
    },
    handleSubmitMainNumber:function(e)
    {
        var mp = this;
      e.preventDefault();
      if(this.state.contactnumber !='')
      $.ajax({
          
          url:'/user/updateuser',
          dataType:'json',
          method:'POST',
          data:{contactnumber:this.state.contactnumber, _id:this.state._id},
          beforeSend:function()
          {
              startSpinner();
          },
          success:function(res){
              if(res.success !==false)
              {
                  mp.setState(res);
                  stopSpinner();
                  showToast('You have updated your main contact number');
              }
          }
          
      }  );
    },
    loadFromGrid:function(e)
    {
        var mp =this;
        var gid = e.target.parentNode.querySelector('input').value;
        console.log(gid);
       $.ajax({
           beforeSend:function()
           {
               
           },
           url:'/user/getimagefromgrid/'+gid,
            dataType:'json',
            success:function(res)
            {
               var  pdialog = document.getElementById('pdialog');
                 pdialog.open();
               var img="data:image/jpeg;base64,"+res.file;
               mp.setState({padimage:img});
              
            }
        }); 
    },
    closePic:function()
    {
        document.getElementById('pdialog').close();
    },
    removeSpeialDay:function(e)
    {
       var mp =this;
     var spid = e.target.parentNode.querySelector('input[name="spdayid"]').value;  
     $.ajax({
         url:'/user/removeopendaysexception',
         method:'POST',
         dataType:'json',
         data:{specialdayid:spid,_id:this.state._id},
         beforeSend:function(){startSpinner();},
         success:function(res)
         {
             if(res.success === true)
             {
               console.log(res);
                mp.setState({opendaysexception: res.opendaysexception.opendaysexception, _id:res.opendaysexception._id});
                showToast('SUCCESS !! Item Deleted')
               
             }
             stopSpinner();
         }
     });
    },
    handleMapSubmit:function(res)
    {
        this.setState(res);
    },
    handleRemoveMobile:function(e)
    {
        
      e.preventDefault();
      var li = (e.target).closest('li');
    
      var mobilenum = li.querySelector('input[name="mobilenumber"]').value;
       var mp =this;
      $.ajax({
          
          url:'/user/removemobile',
          method:'POST',
          dataType:'json',
          data:{_id:this.state._id, mobile:mobilenum.trim()},
          beforeSend:function(){startSpinner();},
          success:function(res)
          {
              if(res.success === true)
              {
                 mp.setState(res.mobiles);
                 stopSpinner();
               
                 showToast('mobile number removed');
              }
          }
          
      });  
    },
    handlServiceChange:function(e)
    {
        var mp = this;
        this.setState({servicename:e.target.value});
        $.ajax({
           url: '/businesstype/regxpfind/'+e.target.value.trim(),
           dataType:'json',
           success:function(res)
           {
              console.log(res);
              mp.setState({businesstype:res}) ;
           }
        });
    },
    handleBreakSubmit:function(e)
    {
        e.preventDefault();
        var mp=this;
        $.ajax({
            
            url:'/user/updateuser',
            method:'POST',
            dataType:'json',
            data:{_id:this.state._id, workbreak:this.state.workbreak}
            ,beforeSend:function()
            {
                startSpinner();
            },
            success(res)
            {
                if(res.success !== false)
                {
                    mp.setState(res);
                    stopSpinner();
                    showToast('Your changes have been saved');
                }
            }
        });
        
    },
   handleSubmmitTask:function(e)
   {
       var mp=this;
       e.preventDefault();
       $.ajax({
           url:'/user/savejob',
           method:'POST',
           dataType:'json',
           data:{jobname:this.state.jobname, jobduration:this.state.jobduration,_id:this.state._id},
           beforeSend:function(){startSpinner()},
           success:function(res){
               if(res.success)
               {
                  
                   mp.setState(res.jobs);
                   mp.taskform.reset();
                   mp.setState({jobname:'',jobduration:''})
                   stopSpinner();
                   showToast('Your changes have been saved');
               }
           }
       });
   },
   handleRemovetask:function(e)
   {
       var mp=this;
       var tsk = (e.target).parentNode;
       if(tsk.tagName !== 'LI')
         tsk = tsk.parentNode;
       var tskid = tsk.querySelector('input').value; 
      
       $.ajax({
           url:'/user/removetask',
           data:{_id:this.state._id,jobid:tskid},
           method:'POST',
           beforeSend:function()
           {
             startSpinner();    
           },
           success:function(res)
           {    stopSpinner();
               if(res.success == true)
               {
                   mp.setState(res.jobs);
                   showToast('You have deleted a service');
                   
               }
            
           }
           
       });
   },
   handleJobChange:function(e)
   {
       var mp = this;
       this.setState({jobname:e.target.value});
        $.ajax({
           url: '/service/regxpfind/'+e.target.value.trim(),
           dataType:'json',
           success:function(res)
           {
              console.log(res);
              mp.setState({services:res}) ;
           }
        });
   },
   render:function()
   {
      // var mapapikey = 'AIzaSyDaFDezXQf6QryH2oFfewgZM3TgZRrh_AE';
       var formtxt = '';
       switch(this.state.part)
       {
           case 'BI':
          
           formtxt = <div>
                <form method="POST" className="fluid" onSubmit={this.handleSubmitImage} ref={function(mf){this.BIFORM=mf}.bind(this)}>
                  <p style={{fontSize:'16pt', color:'#294b77'}}>Business Logo</p>
                  <div style={{position:'relative', width:'150px'}}>
                  <canvas  style={{display:'none'}} id="canv"></canvas>
                   <img className="sqavatar" width="150" style={{position:'absolute', top:'0px', opacity:'0'}} id="pimg" />
                  <img className="sqavatar" src={this.state.profilethumb} width="150" id="ppic" />
                 
                  </div>
                   
                  <input type="file"  onChange={this.handleImageChange} style={{opacity:'0.6' }}/>
                   <img src='' width='480' id="invimg" style={{position:'absolute', opacity:'0', zIndex:'-1'}} />
                  <button disabled ref ={function(btn){this.imgbtn = btn}.bind(this)}>Save</button>
                </form>
                <form method="POST" className="fluid" onSubmit={this.handleInfoSubmit} >
                 <p>Business Name</p>
                  <input type="text" value ={this.state.businessname} onChange={this.handleInputChange} name="businessname"  />
                  <p>Main contact person for your business</p>
                  <input type="text" value ={this.state.contactname} onChange={this.handleInputChange} name="contactname" />
                 
                  <p>Date you started doing business</p>
                  <input type="date" required  onChange={this.handleInputChange} value={this.state.dateformed} name="dateformed"/>
                   <p>Service Name</p>
                  <input type="text" list="services" value ={this.state.servicename} onChange={this.handlServiceChange}   />
                   <datalist id="services">
                      {this.state.businesstype.map((tval,indx)=>{return(<option key={tval.businesstypeid}>{tval.businesstypename}</option>)})}
                    </datalist>
                   <button>Save</button>
             </form>
             <div>
             
              <p style={{fontSize:'16pt', color:'#294b77'}}>Telephone numbers for your business <button onClick={this.handleClickPhone}> <iron-icon icon="add"></iron-icon></button></p>
               <div style={{display:'inline-block',maxHeight:'0px', overflow:'hidden'}} className="transh"  id="ph">
               <form onSubmit={this.handleSubmitMainNumber}>
                 <p>Main Phone</p>
                   <input type="number" name ="contactnumber" onChange={this.handleInputChange}  value={this.state.contactnumber} />
                  <button>save</button>
             </form>
              <form className="fluid" onSubmit={this.handlePhoneSubmit} ref={function(mob){this.MOBILEFORM=mob}.bind(this)} >
                 
                  <p>Enter new mobile phone No.</p>
                  <input type="number" className="num"   onChange={this.handleInputChange} name="mobile" onBlur={this.validatePhone} />
                 
                  <button>Save</button>
             </form>
            
                  
            <p>Mobile Phones</p>
            <ul className="text" style={{listStyle:'none'}}>
               {this.state.mobilelist.map(function(lv,indx){ if(lv !== null) return <li key={indx}> 
               <paper-icon-button onClick={this.handleRemoveMobile} icon="close" style ={{color:'red', width:'32px', height:'32px'}}>
               </paper-icon-button>{lv}
               <input type='hidden' value={lv} name="mobilenumber" readOnly />
               </li>}.bind(this))}
            </ul>
            </div>
             </div>
             </div>
             break;
             case 'BA':
               formtxt = 
               <div>
               <form onSubmit={this.handleSubmitCountry} className="fluid">
                <p>Country</p>
                <CountrySelect url="/static/countries.json"
                  value={this.state.country}
                  onChange={this.handleInputChange}
                  name="country"
                  />
                  <p>Street</p>
                  <input type="text" placeholder='Street'  onChange={this.handleInputChange} value= {this.state.street} name="street" />
                   <p>Town</p>
                    <input style={{display:'none'}} name="businesstwn" />
                    <input list="towns" autocomplete="off"  value= {this.state.businesstwn}  placeholder="eg Asgard" onChange={this.handlBtwnChange} onKeyUp={this.handleTextDDChange} />
                     <datalist id="towns">
                      {this.state.townlist.map((tval,indx)=>{return(<option value={tval.name} key={tval.nameid}>{tval.name},{tval.country}</option>)})}
                     </datalist>
                   
                   <p>Zip</p>
                   <input type="text" placeholder='12345'  onChange={this.handleInputChange} value= {this.state.zip} name="zip" />
                  <button>Save</button>
                  </form>
                  <BMap formSubmit ={this.handleMapSubmit} markers={this.state.mapMarkers} businessname={this.state.businessname} />
                  </div>           
              break;
              case 'EP':
               formtxt = <form className="fluid" onSubmit={this.handleEmailPassSubmit}>
                  <p>Email</p>
                  <input type="email" placeholder='email'  onChange={this.handleInputChange} value= {this.state.mainemail} name="mainemail"/>
                   <p>Change password</p>
                  <input type="password" placeholder='Password'  onChange={this.handleInputChange} value= {this.state.password} name="password" />
                  <input type="password" placeholder='Repeat Password'  onChange={this.handleInputChange} value= {this.state.passwordr} name="passwordr" />
                  <p>Backup email</p>
                  <input type="email" placeholder='backupemail'  onChange={this.handleInputChange} value= {this.state.backupemail}  name="backupemail" />
                  <button>Save</button>
                  </form>
             break;  
             case 'PAD':
            
             formtxt =<div>
            
              <form className="fluid" onSubmit={this.handlepPADSubmit} >
              <input type="file" name='photo' required onChange={this.handlePADChange} />
              <label>Media type</label>
              <select name="mediatype" required onChange={this.handleInputChange} value={this.state.mediatype}>
                <option value="photo">Photo</option>
                <option value="advert">Ad</option>
              </select> 
             <canvas  style={{display:'none'}} id="canvpad"></canvas>
              <img className="sqavatar" width="150" style={{position:'absolute', top:'0px', opacity:'0'}} id="padimg" />
              <img className="sqavatar" src={this.state.selectedpadthumb} width="150" id="padpic" />
                <img src='' width='480' id="invimgpad" style={{position:'absolute', opacity:'0', zIndex:'-1'}} />
             <p> <button>Save</button></p>
             </form>
              <p style={{fontSize:'16pt', background: '#949a53', margin:'0px', padding:'10px', color:'#294b77'}}>Photos</p>
             <ul className="photoholder">
            
               {  this.state.images.map(function(lv,indx){ if(lv !== null) 
                   if(lv.mediatype=== 'photo' || lv.mediatype=== null)
                   return <li key={indx}>
                     <input type="hidden" value={lv.gridid} ref={(inpt)=>this.photoid=inpt} />
                   <img src={lv.thumb} onClick={this.loadFromGrid}/>
                   <div style={{position:'absolute', bottom:'0px', right:'0px'}}>
                   <paper-icon-button style={{borderRadius:'50%', background:'#e64b55'}} icon="delete"></paper-icon-button></div> </li>}.bind(this))}
             </ul>
              <p style={{fontSize:'16pt', background: '#949a53', margin:'0px', padding:'10px', color:'#294b77'}}>Ads</p>
             <ul className="photoholder">
               {this.state.images.map(function(lv,indx){ if(lv !== null) 
                   if(lv.mediatype=== 'advert')
                   return <li key={indx}><img src={lv.thumb} onClick={this.loadFromGrid} /> 
                   <input type="hidden" value={lv.gridid} ref={(inpt)=>this.adid=inpt} />
                   <div style={{position:'absolute', bottom:'0px', right:'0px'}}>
                   <paper-icon-button style={{borderRadius:'50%', background:'#e64b55'}} icon="delete"></paper-icon-button></div></li>}.bind(this))}
             </ul>
             <paper-dialog id="pdialog"  entry-animation="scale-up-animation"
              exit-animation="fade-out-animation">
              
             <div>
               <img src={this.state.padimage} />
             </div>
             <div><paper-icon-button icon="close" onClick={this.closePic}></paper-icon-button></div>
             </paper-dialog>
             </div>
             break;
             case 'RULES':
             formtxt = <div>
             <div style={{display:'block',clear:'both' ,overflow:'auto'}}>
             <form onSubmit={this.handleBreakSubmit}>
             <p> <label>Time in minutes between clients</label></p>
             <input style={{width:'100px', marginRight:'20px'}} type="number" value={this.state.workbreak} name="workbreak" onChange={this.handleInputChange} />
             <button>Save</button>
             </form>
             <paper-material elevation="1" style={{overflow:'auto', margin:'2px', padding:'5px'}}>
                <p style={{fontSize:'12pt', background: '#949a53', margin:'0px 0px 1px 0px', padding:'10px', color:'#294b77'}}>Select your normal opening hours for each day of the week</p>
                <ul style={{listStyle:'none', margin:'0px', padding:'0px'}}> 
                   {this.state.opendays.map(function(day,indx){
                       if(day.closed ==="true")
                         day.closed = true;
                       else
                         day.closed = false;
                       return(<li key={day.day}><DayBox value={day.day} data={day} /></li>)})}
                </ul>
                </paper-material>
                 
             
             </div>
             <div><p style={{fontSize:'12pt', background: '#949a53', margin:'0px', padding:'10px', marginTop:'10px', color:'#294b77'}}> Special opening hours <i> Note: this will overide the normal opening hours for that day </i> </p></div>
             <form style={{width:'300px'}} onSubmit={this.saveSpecialDayInfo}>
              <label>Select a date</label>
             
              <input type="date" onChange={this.handleInputChange} value={this.state.specialdate} required  name="specialdate" />
               <p><input style={{height:'20px',width:'20px'}} type="checkbox" onChange={this.handleClosedChanged} /> Coosed for the day</p>
              <label>Opened from</label>
              <input type="time"  onChange={this.handleInputChange} value={this.state.specialopeninghour} name="specialopeninghour" disabled={this.state.closed} />
              <label>Opened to:</label>
              <input type="time" onChange={this.handleInputChange} value={this.state.specialclosinghour}  name="specialclosinghour" disabled={this.state.closed} />
              <button>Save</button>
              </form>
              
              <ul style={{listStyle:'none', paddingLeft:'0px'}}>
                 {this.state.opendaysexception.map((spday, index)=>
                     {
                   if(spday.closed ==='true')
                    {
                      return(<li key={index}><paper-material><div className="labeldiv">Date: {spday.specialdate}</div><div className="labeldiv">Closed</div> 
                      <input type="hidden" value={spday.specialdayid} name="spdayid" />
                       <iron-icon icon="close"  onClick={this.removeSpeialDay} style={{display:'block', cursor:'pointer',marginRight:'5px', marginTop:'20px', float:'right', borderRadius:'50%', background:'#fafafa', color:'red' ,padding:'5px'}}></iron-icon></paper-material></li>);
                     }
                     else{    
                  return(<li key={index}>
                  
                  <paper-material>
                  <div className="labeldiv">Date: {spday.specialdate}</div>
                  <div className="labeldiv">Opened from: <time>{spday.specialopeninghour}</time></div>
                  <div className="labeldiv">Closing hour: <time>{spday.specialclosinghour}</time></div>
                  <input type="hidden" value={spday.specialdayid} name="spdayid" />
                  <iron-icon icon="close" onClick={this.removeSpeialDay} style={{display:'block', marginRight:'5px', cursor:'pointer', marginTop:'20px', float:'right', borderRadius:'50%', background:'#fafafa', color:'red'}}>
                  </iron-icon>
                 </paper-material>
                 </li>
                 )
                 }
                })}
              </ul>
              
             </div>
             break;
             case'SRV':
             formtxt = <div>
             <p>Add the service or services you offer at your place of business.</p>
             <form onSubmit={this.handleSubmmitTask} ref={function(frm){this.taskform =frm}.bind(this)} className="fluid">
              <label>Name of the service </label>
              <input type="text" onChange={this.handleJobChange} value={this.state.jobname} list="subserv" />
              <datalist id="subserv">
                   {this.state.services.map((tval,indx)=>{return(<option key={tval.serviceid}>{tval.servicename}</option>)})}
              </datalist>
              <label>Duration of this service in Munites (average)</label>
              <input type="number" onChange={this.handleInputChange} value={this.state.jobduration} name='jobduration' />
              <button>Save</button>
             </form>
             <paper-material style={{overflow:'auto', padding:'10px'}}>
             <ul style={{listStyle:'none'}}>
              
               {this.state.jobs.map(function(tsk,indx){return(<li key={tsk.jobid} style={{display:'block',clear:'both'}}>
               <div style={{display:'block', paddingRight:'20px',float:'left'}}><b>Service Name:</b> {tsk.jobname}</div>
               <div style={{display:'block', float:'left'}}><b>Time per client:</b> {tsk.jobduration} Mins</div>
               <input type="hidden" value={tsk.jobid} name="task" />
               <paper-icon-button icon="close" style={{display:'block', float:'right'}} onClick={this.handleRemovetask}></paper-icon-button>
                </li>)}.bind(this))}
             </ul>
             </paper-material>
             </div>
             
             
           
       }
      return(
          <div>
           
          <ul className="left profilelist">
           <li key={1} onClick={this.handleListClickBI} onBlur={this.handleBlur} >
           <iron-icon style={{color:'#fe464e'}} icon="communication:contacts"></iron-icon> <p>Business Contact and Info</p>
           </li>
           <li key={2} onClick={this.handleListClickBA}>
           <iron-icon style={{color:'#d9d92b'}} icon="maps:person-pin-circle"></iron-icon><p>Address and Directions</p>
           </li>
           <li key={3} onClick={this.handleListClickEmail}>
           <iron-icon style={{color:'#5a7840'}} icon="communication:mail-outline"></iron-icon><p>Email and Passwords</p>
           </li>
            <li key={4} onClick={this.handleListClickAds}>
           <iron-icon style={{color:'#92c676'}} icon="icons:card-giftcard"></iron-icon><p>Ads and Photos</p>
           </li>
           <li key={5} onClick={this.handleListClickRules}>
           <iron-icon style={{color:'#423756'}} icon="icons:schedule"></iron-icon><p>Opening Hours</p>
           </li>
           <li key={6} onClick={this.handleListClickServices}>
           <iron-icon style={{color:'blue'}} icon="icons:assignment"></iron-icon><p>Services Offered</p>
           </li>
           </ul>
           
          <div className="user paper profform">
            {formtxt}
          </div>
         
       </div>);
   }
});

var EditBusinessProfilePage = React.createClass({
    componentDidMount:function()
    {
     
      
    },
    render:function(){
        var userId = document.getElementById('_id').value;
       return( <div>
        
        <BProfilePage data={{username:'jozreel', source:"/user/findbyid/"+userId}} />
        </div>);
    }
});

var CountrySelect = React.createClass(
    {
     propTypes: {
        url: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            options: []
           
        }
      },
      componentDidMount: function() {
        // get your data
        $.ajax({
            url: this.props.url,
            success: this.successHandler
        })
    },
   
    successHandler: function(data) {
        data = JSON.parse(data);
       
        // assuming data is an array of {name: "foo", value: "bar"}
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            this.state.options.push(
                <option key={i} value={option.code}>{option.name}</option>
            );
        }
        this.forceUpdate();
    },
     render: function() {
        return(
            <select value={this.props.value} onChange={this.props.onChange} name={this.props.name} >{this.state.options}</select>
        )
    }
    }
);
var BMap = React.createClass({
getInitialState:function(){
    var mark;
    if(this.props.markers)
     mark =this.props.markers;
    else 
      mark =[];
    return({map:'', markers:mark, latlang:'', markercoll:[],searchRes:[]})},
componentDidMount:function()
{
  
     var mp=this;
     this._map.innerHTML='<google-map id="gmap" zoom="15"  click-events api-key="AIzaSyDaFDezXQf6QryH2oFfewgZM3TgZRrh_AE" }></google-map>';
    this.getGeolocation();
    var browserSupportFlag = new Boolean();
    if(navigator.geolocation) {
    var map = document.getElementById('gmap');
    
    if(map.map)
      this.setMapCenter();
    else
    {
      map.addEventListener('google-map-ready',function(e)
       {
       
        mp.setMapCenter();
      /* browserSupportFlag = true;
       navigator.geolocation.getCurrentPosition(function(position) {
       var  initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
     
      map.map.setCenter(initialLocation);
      mp.createMarkers(map.map);
     });*/
    });
    }
    
    
    }
    else{
        alert('We are sorry but we do not cater for dinosaurs');
    }
    
      //this.myMap.apiKey='AIzaSyDaFDezXQf6QryH2oFfewgZM3TgZRrh_AE';
      //console.log(this.myMap.apiKey);
      //document.getElementById('mp').apiKey= 'AIzaSyDaFDezXQf6QryH2oFfewgZM3TgZRrh_AE';
 
    
},
 setMapCenter:function()
    {
      
      var mp=this;
       this.getGeolocation();
      if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      var  initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      var map = document.getElementById('gmap');
     
     
       map.map.setCenter(initialLocation);
        google.maps.event.addListener(map.map, 'dblclick', function(e) {
               // map.setZoom(15);
              
               
                 mp.placeMarker(e.latLng, map.map);
    
        });
      mp.createMarkers(map.map);
      });
      }
      else{
          alert('we are sorry we do not support dinosaurs');
      }
     
  
    },
createMarkers:function(map)
{
    var mp = this;
    for(var i = 0; i < this.state.markers.length;i++)
    {
     
    if(this.state.markers[i] === null)
      continue;   
   
    var infowindow = new google.maps.InfoWindow();
     infowindow.setContent(mp.props.businessname);
     var id = mp.state.markers.length;
    var iconBase = '/image/marker.png';
    var opts = JSON.parse(JSON.stringify(this.state.markers[i]));
     opts.map = map
    
  
     var marker = new google.maps.Marker(opts);
     
     infowindow.open(map, marker);
     marker.addListener('rightclick', function() {
      
        
         var nmarker = mp.state.markercoll[this.id];
         delete mp.state.markercoll[this.id];
         mp.state.markers.splice(this.id,1);
         //delete mp.state.markers[this.id];
         
         nmarker.setMap(null);
         
         
     });
     marker.infowindow = infowindow;
    mp.state.markercoll[marker.id] =marker;
    marker.addListener('click', function() {
    this.infowindow.close();
    var infowindowcl = new google.maps.InfoWindow();
    infowindowcl.setContent(mp.props.businessname);
    infowindowcl.open(map, this);
     }); 
    
   
   
   /// mp.minpt.value = marker.id;
   
    map.panTo(opts.position);
    }
    
},
drawMarker:function(e)
{   e.preventDefault();
    var mp=this;
    var map =document.getElementById('gmap').map;
    console.log( e.target.parentNode);
    var lat = e.target.parentNode.querySelector('input[name="latvalue"]').value;
    var lng = e.target.parentNode.querySelector('input[name="lngvalue"]').value;
    var id = this.state.markers.length;
     var position = {lat:parseFloat(lat), lng:parseFloat(lng)};
      console.log(position);
    console.log(lat,lng);
    var opts = {
       
     position:position,
      icon: '/image/marker.png',
      title:mp.props.businessname,
      optimized:false,
      id:id,
       map:map
    }
     var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker(opts);
    infowindow.setContent(mp.props.businessname);
    infowindow.open(map, marker);
     marker.addListener('rightclick', function() {
         var nmarker = mp.state.markercoll[this.id];
         delete mp.state.markercoll[this.id];
         mp.state.markers.splice(this.id,1);
         //delete mp.state.markers[this.id];
         nmarker.setMap(null);
         
         
     });
    marker.addListener('click', function() {
    infowindow.setContent(mp.props.businessname);
    infowindow.open(map, marker);
     }); 
    
    mp.state.markercoll[marker.id] =marker;
   mp.state.markers[id] = { position:position,
      icon: '/image/marker.png',
      title:mp.props.businessname,
      optimized:false,
      id:id}
   /// mp.minpt.value = marker.id;
   
    map.panTo(opts.position); 
  
},
formSubmit:function(e)
{
    var mp =this;
    e.preventDefault();
   var markers =this.state.markers;
   var id = document.getElementById('_id').value;
   console.log(markers);
   var mapdata = JSON.stringify({_id:id, markers:markers});
   $.ajax({
       method:'POST',
       dataType:'json',
       data:mapdata,
       url:'/user/savelocationdetails',
       beforeSend:function(){startSpinner();},
       success:function(res)
       {
           stopSpinner();
           mp.props.formSubmit(res);
           if(res.success !== false)
             showToast('Location details saved');
       }

   });
},
searchMap:function()
{
  var mp =this;
    var map = document.getElementById('gmap').map;
      var service = new google.maps.places.PlacesService(map);
   
    var lat= map.center.lat();
    var long = map.center.lng();
    var loc = {lat: lat, lng: long};
    
    var request = {
    location: loc,
    radius: '500',
    query:this.props.businessname
  };
 var geocoder = new google.maps.Geocoder();
geocoder.geocode( {location:map.center}, function(resultsgc, statusgc) {
 var country ='';
 
 if (statusgc == google.maps.GeocoderStatus.OK) {
          var f;
         
          for(var i=0;i<resultsgc.length; i++)
          {
             f  = resultsgc[i].types.find(function(value)
              {  
                  //var con;
                  return(value ==='country');
                  
                   
              });
             
          
         if(f ==='country')
         {  
             country = resultsgc[i].formatted_address;
            break;
             
         }
       }
     }

  service.textSearch(request, (result,status)=>{
      
      if((result.length === 1 && result[0].formatted_address.indexOf(country) !== -1)|| result.length > 1)
         {
             mp.createPlacesDiv(result);
             mp.setState({stext: 'We found these business in your area with the same name as yours'});  
         }
  });
});
 
},
searchGeocode:function()
{
    var geocoder = new google.maps.Geocoder();
      var map = document.getElementById('gmap').map;
       var service = new google.maps.places.PlacesService(map);
   console.log(map.country);
    var lat= map.center.lat();
    var long = map.center.lng();
    var loc = {lat: lat, lng: long};
      var mapOptions = {
      zoom: 8,
      center: loc
    }
    var mp= this;
     var country = '';
   var address = mp.state.businessname;
    geocoder.geocode( {location:map.center}, function(results, status) {
    
      if (status == google.maps.GeocoderStatus.OK) {
          var f;
          for(var i=0;i<results.length; i++)
          {
             f  = results[i].types.find(function(value)
              {  
                  //var con;
                  return(value ==='country');
                  
                   
              });
             
          console.log(f);
         if(f ==='country')
         {  
             country = results[i].formatted_address;
            break;
             
         }
       }
          geocoder.geocode( {location:map.center,address: 'aid bank',
              componentRestrictions: {
             country: country
          }}, function(results, status) {
              console.log(results);
          });
       /* map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });*/
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  
},
addloc:function(e)
{e.preventDefault();
  alert('bim');  
},
createPlacesDiv:function(result)
{
  //  var pdic ='<div>';
  this.setState({searchRes:result});
  /* for(var i in result)
   {
       console.log(result[i]);
       pdic+='<div class="btstyle"><p>'+result[i].name+'</p><p>'+result[i].formatted_address+'</p><button onClick={this.addloc}></div>';
       
   }
   pdic +='</div>';
    this._mdiv.innerHTML=pdic;*/
},
    placeMarker:function(position, map) {
    var marker;
    var mp=this;
    var infowindow = new google.maps.InfoWindow();
     infowindow.setContent(mp.props.businessname);
     var id = mp.state.markers.length;
    var iconBase = '/image/marker.png';
    var mopts = {
      position: position,
     
     icon: iconBase,
      title:mp.props.businessname,
      optimized:false,
      id:id,
       map:map
    }
   
    mp.state.markers[id]={icon: iconBase,
      title:mp.props.businessname,
      optimized:false,
      id:id,
      position:{lat:position.lat(),
      lng: position.lng()}
      
    };
    console.log(mp.state.markers, 'markers');
     marker = new google.maps.Marker(mopts);
    infowindow.open(map, marker);
     marker.addListener('rightclick', function() {
         var nmarker = mp.state.markercoll[this.id];
         delete mp.state.markercoll[this.id];
          mp.state.markers.splice(this.id,1);
        // delete mp.state.markers[this.id];
         nmarker.setMap(null);
         
     });
    marker.addListener('click', function() {
    infowindow.setContent(mp.props.businessname);
    infowindow.open(map, marker);
     }); 
    
    mp.state.markercoll[marker.id] =marker;
   
   /// mp.minpt.value = marker.id;
   console.log(mp.state.markers);
    map.panTo(position);
    },

 getGeolocation:function()
   {
     var browserSupportFlag =  new Boolean();  
     
    var mp = this;

    if(navigator.geolocation) {
    var map = document.getElementById('gmap');
   // map.addEventListener('api-load',function(e)
    //{
      
       browserSupportFlag = true;
       navigator.geolocation.getCurrentPosition(function(position) {
       var  initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
     
      map.map.setCenter(initialLocation);
      mp.searchMap();
     /*google.maps.event.addListener(map.map, 'dblclick', function(e) {
               // map.setZoom(15);
              
               
                 mp.placeMarker(e.latLng, map.map);
    
     });*/
    }, 
    function() {
      handleNoGeolocation(browserSupportFlag);
    });
   // });
   
   
    }
    else
    {
      browserSupportFlag = false;
    }
   },
   markersChanged:function(e)
   {   this.setState({latlang:e.target.value});
       console.log(this.state.markers);
   },
render:function()
{  
    return(
        <div>
        <form onSubmit={this.formSubmit}>
        <p style={{fontSize:'16pt', color:'#294b77'}}>Choose a location on the map where your place of business is</p>
        <div style={{height:'400px', width:'60%', border:'1px solid rgba(139,195,74,0.3)', boxShadow:'1px 3px 1px 1px #ccc', borderRadius:'4px', display:'inline-block'}} ref={(m)=> this._map = m}>{this.state.map}</div>
        <div ref={(dv)=>this._mdiv = dv} style={{width:'30%', display:'inline-block', paddingLeft:'10px', verticalAlign:'top'}}>
        <p>{this.state.stext}</p>
        <ul style={{padding: '0px', margin: '0px'}}>
        {this.state.searchRes.map((lv,indx)=>{ if(lv !== null)
             return (<li  className="btstyle" key={indx}><p>{lv.name}</p>
             <p>{lv.formatted_address}</p><button onClick={this.drawMarker}>+ Loc</button>
             <input type="hidden" value={lv.geometry.location.lat()} name="latvalue" />
              <input type="hidden" value={lv.geometry.location.lng()} name="lngvalue" />
             </li>)})}
        </ul>
        </div>
         <p> <button>Save Location</button></p>
         </form>
        </div>);
}   
});

var DayBox = React.createClass({
    getInitialState:function(){
        console.log(this.props.data);
        return({closed:this.props.data.closed, day:this.props.value, opentime:this.props.data.opentime, closetime:this.props.data.closetime});
    },
    
    handleClosedChanged:function(e)
    {
        console.log(e.target.checked);
        if(e.target.checked)
           this.setState({closed:true});
         else
           this.setState({closed:false});
          
    },
    handleOpenTimeChange:function(e)
    {
      this.setState({opentime:e.target.value});
    },
    handleCloseTimeChange:function(e)
    {
        this.setState({closetime:e.target.value});
    },
    saveDayInfo:function(e)
    {
        e.preventDefault();
        var dayinfo = {opentime:this.state.opentime, closetime:this.state.closetime, closed:this.state.closed, day:this.state.day,_id:document.getElementById('_id').value}
        $.ajax({
            url:'/user/saveopeninghours',
            method:'POST',
            dataType:'json',
            data:dayinfo,
            beforeSend:function(){
                document.getElementById('spinner').style.display='block'; 
            }
            ,
            success:function()
            {
                document.getElementById('spinner').active = false;
                document.getElementById('spinner').style.display='none';  
            }
        })
    },
    render:function() {
    return(
        
            <div style={{padding:'5px', overflow:'auto',marginBottom:'10px', border:'1px solid #c0c0a8'}}>
            <form onSubmit={this.saveDayInfo}>
            <p>{this.state.day}</p>
            <p><input style={{height:'18px', width:'18px',marginBottom:'0px'}} onChange={this.handleClosedChanged} type="checkbox" checked={this.state.closed} /> Closed for the day</p>
            <div style={{display:'block', margin:'0px', width:'300px', float:'left'}} >
            <label>Opened From: </label>
             <input disabled={this.state.closed} style={{width:'200px', display:'inlineBlock'}} type="time" onChange={this.handleOpenTimeChange} value={this.state.opentime} />
            </div>
             <div style={{display:'block', margin:'0px', width:'300px', float:'left'}}>
            <label>Opened To: </label>
             <input disabled={this.state.closed} style={{width:'200px', display:'inlineBlock'}} type="time" onChange={this.handleCloseTimeChange} value={this.state.closetime} />
            
            </div>
            <div style={{display:'block', float:'right'}}> <button>Save</button></div>
            </form>
           
            </div>
        
    );
}
});
ReactDOM.render(<EditBusinessProfilePage  />, document.getElementById('bprofile'));

