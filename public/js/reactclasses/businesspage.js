var BusinessDisplay = React.createClass({
    getInitialState:function()
    {
        var now = new Date();
        var day = now.getDate();
        var month = now.getMonth()+1;
        var year = now.getFullYear();
        if(day <10 ) day = '0'+day;
        if(month < 10) month = '0'+month;
        var today = year+'-'+month+'-'+day;
        return{availabletimes:[], services:[],images:[], workers:[], primiumuser:true, selectedService:'', lookupServiceChanged:false, lookupdate:today,opentimes:[]}
    },
    componentDidMount:function()
    {
        
         this.findAvailableTimes();
         this.getBasicInfo();
      
    },
    getBasicInfo:function()
    { var ctx = this;
        var id = document.getElementById('businessid').value;
        $.get('/user/getbasicuserinfo/'+id, function(res){
            console.log(res, 'docu');
            ctx.setState({services:res.jobs, opentimes:res.opendays,profilethumb:res.profilethumb, businessname:res.businessname});
        });
    },
    findAvailableTimes:function()
    { var id = document.getElementById('businessid').value;
        var url = "/user/getavailabletimes/"+id+"/"+this.state.lookupdate;
        if(this.state.lookupServiceChanged)
        {
          url = "/user/getavailabletimes/"+id+"/"+this.state.lookupdate+'/'+this.state.lookupservice;
          this.setState({lookupServiceChanged:false});
        }
       
         var bp = this;
           console.log(bp.state.lookupservice, 'service');
        
         console.log("/user/getavailabletimes/"+id+"/"+this.state.lookupdate);
        $.ajax({
          beforeSend:function()
          {
              startSpinner();
          },
          url:url,
          success:function(res)
          {
              
              if(res.success !==  false)
              {
            //  var openTime = res.opentime;
              
                console.log(res, 'workers');
                bp.setState(res);
                
              }
              else{
                  showToast(res.message);
              }
              bp.getMediaInfo(id);
              bp.hiddendiv.style.opacity='1';
              
              
              stopSpinner();
              
          },
          dataType:'json'
      });    
    },
    getMediaInfo:function(id)
    {
        var bp=this;
        $.ajax({
          url:"/user/getimageandads/"+id,
          success:function(res)
          {
             // var openTime = res.opentime;
               console.log(res);  
           
                bp.setState({images:res.images});
                document.getElementById('businesscont').style.opacity='1';
                
              
          },
          dataType:'json'
      });    
    },
    handleSlotClick:function(e)
    {
      e.stopPropagation();
    var workerid = e.target.parentNode.querySelector('input[name="workerid"]').value;
    var currwk;
    for(var iwk=0; iwk<this.state.workers.length; iwk++)
    {
        if(workerid === this.state.workers[iwk]._id)
        {
          this.setState({currentWorker:this.state.workers[iwk]});
          currwk = this.state.workers[iwk];
        }
        
    }
    
    var starttimeinpt = e.target.querySelector('input[name="starthour"]');
     var ssst =e.target.querySelector('input[name="slotstart"]').value;
      if(!currwk.dayisspecial)
      {
        this.setState({opentime: currwk.worktimes[0].open});
        this.setState({closetime:currwk.worktimes[0].close});
      }
      else
      {
          var slh= '01/01/2016 '+starttimeinpt.value;
         for(var sd =0; sd< currwk.worktimes.length; sd++) 
         {
             console.log(currwk.worktimes[sd].open,starttimeinpt.value,'ohr');
            // console.log(this.state.opentimes[sd].open, this.state.opentimes[sd].close, starttimeinpt.value,'icoff');
             var oh = '01/01/2016 '+currwk.worktimes[sd].open;
            var ch = '01/01/2016 '+currwk.worktimes[sd].close;
             
             console.log(Date.parse(slh), Date.parse(oh),'ppkoko');
           if(Date.parse(slh) >= Date.parse(oh) && Date.parse(slh) < Date.parse(ch))
           {
             
              this.setState({opentime:currwk.worktimes[sd].open});
              this.setState({closetime:currwk.worktimes[sd].close});
           }
         }
      }
      
     
       var left = e.target.offsetLeft;
       var pm = e.target.parentNode.querySelector('paper-material');
        var top =  80;
        var slotleft = e.target.parentNode.offsetLeft;
       // var leftmin = left - slotleft;
       var olftdiff = parseInt(left)-parseInt(slotleft);
        //var pm = tl.querySelector('paper-material');
       
        
        this.setState({selectedslotendtime:e.target.querySelector('input[name="slotend"]').value});
         this.setState({selectedslotstarttime:ssst});
         var leftmin = olftdiff;
        
        if(starttimeinpt)
        {
          var  starttime = starttimeinpt.value;
          this.setState({clickedSlotStartHour:starttime});
        var form  = e.target.querySelector('form');
        if(form)
          form.reset();
      
        if(pm)
        { 
           // pm.classList.remove('notShown');
            pm.style.height='0px';
           
           
            
            pm.style.left = left+'px';
            pm.style.top='80px';
           
            pm.style.height='240px';
            pm.style.display = 'block';
            
             //pm.classList.add('shown'); 
            var minstart  = leftmin;
            var st = starttime.split(':');
            var starthour = parseInt(st[0]);
            var startmin = parseInt(st[1]);
            
            var hours = parseInt(minstart /60);
          
            var remain = minstart % 60;
          
            var rhour = starthour;
            var rmin = startmin;;
            if(hours >= 1)
            {
               rhour = starthour + hours;
               
               
            }
            rmin +=parseInt(remain);
            if(rmin > 60)
            {
              rhour+= parseInt(rmin/60);
              rmin = parseInt(rmin%60)
            }
           if(rhour <10) 
             rhour = '0'+rhour;
           
            if(rmin < 10)
              rmin = '0'+rmin;
            var stm = rhour+':'+rmin;
          
            var rms = parseInt(minstart)+parseInt(ssst);
            
          //  this.setState({selectedTimeStart:stm, minstart:rms,bdd:true});
            this.forceUpdate();
            
        }
        }
    },
    handleStartTimeChange:function(e)
    {
        var pmaterial = e.target.parentNode.parentNode;
       
        console.log(this.state.opentime);
        var tarr = e.target.value.split(':');
        var starttimearr = this.state.opentime.split(':');
        var mintime = (parseInt(tarr[0]) * 60) + parseInt(tarr[1]);
        var minstart =(parseInt(starttimearr[0]) *60) +parseInt(starttimearr[1]);
        var endmin = pmaterial.querySelector('input[name="endmin"]').value;
        endmin = parseInt(endmin);
        var diff = mintime - minstart;
         this.setState({selectedTimeStart:e.target.value});
        if(diff < endmin && diff >0)
        {
           
          //  pmaterial.style.left = diff+'px';
           
           
            //this.forceUpdate();
             
        }
          this.setState({minstart:diff});
          
          pmaterial.querySelector('select').value= null;
         this.forceUpdate();
         //console.log(diff, mintime,minstart, endmin);
        
       
    },
    handleDrag:function(e)
    {
        console.log(e.pageX);
    },
    hideform:function(e)
    {
     e.preventDefault();
 
     e.target.parentNode.parentNode.style.display="none";
     
    },
    HandleGeneralClicks(e)
    {
         
         if(this.state.bdd)
         {
           this.setState({bdd:false});
           document.querySelector('.bkbox').style.display="none";
           
         }
         // this.setState({bdd:false});
       
    },
    handleBook(e)
    { e.preventDefault();
        console.log(this.state.dooropener, this.state.doorcloser);
        if(this.state.selectedService !== '') 
        {
            var starttimearr = this.state.dooropener.split(':');

           var opentimedaymin =(parseInt(starttimearr[0]) *60) +parseInt(starttimearr[1]); 
        
        
           var endbk = parseInt(this.state.minstart)+ parseInt(this.state.selectedDuration);
          
           var endbkinday = endbk+ opentimedaymin;
           this.setState({minend:endbk});
          
           var endresvHour =parseInt(endbkinday/60);
           var endresvmin = parseInt(endbkinday % 60);
           
           //var st = starttime.split(':');
           // var starthour = parseInt(st[0]);
           if(endresvmin < 10)
              endresvmin ='0'+endresvmin
          if(endresvHour < 10)
              endresvHour ='0'+endresvHour
          var endhr = endresvHour+':'+endresvmin;
           this.setState({endhour:endhr});
           document.getElementById('pdbook').open();
           document.querySelector('.bkbox').style.display='none';
           console.log(this.state.minstart,this.state.selectedDuration,endbk,this.state.selectedTimeStart,endhr,'ioio');
        }
        else
        {  
            showToast('Please select a service or valid time slot');
        }
    },
    closeBdiag(e)
    {
         document.getElementById('pdbook').close();
    },
    selectedServiceChange(e)
    {
        console.log(this.state.selectedTimeStart);
        this.setState({selectedDuration:e.target.selectedOptions[0].dataset.duration});
        this.setState({selectedservicename:e.target.selectedOptions[0].text});
        this.setState({selectedService:e.target.value});
    },
    handleBookin(e)
    {
         e.preventDefault();
       
        var ati= this;
       
     
      $.ajax({
          method:'POST',
          dataType:'json',
          data:{begintime:this.state.minstart, email:this.state.reqemail, _id:this.state.currentWorker._id, 
              contactnumber:this.state.reqtel, enndtime:this.state.minend, name:this.state.reqname, starthour:this.state.selectedTimeStart,
             date:this.state.lookupdate ,slottodel:this.state.clickedSlotStartHour, service:this.state.selectedService
        },
          url:'/user/fillSlot',
          beforeSend:function(){
              startSpinner();
          },
          success:function(res)
          {
             stopSpinner();
             if(res.success)
             {
                ati.setState({availabletimes:res.availabletimes});
                console.log(res.availabletimes);
               showToast('Your request has been sent please await confirmation via email or telephone');
                document.getElementById('pdbook').close();
             }
          }
          
      });
     
    },
    preventClose:function(e){
      e.stopPropagation();
    },
   handleSearchDateChange(e){
     this.setState({lookupdate:e.target.value});  
     
   },
   handleSearchServiceChange(e){this.setState({lookupservice:e.target.value, lookupServiceChanged:true});},
    handleInputChange(e)
    {
      console.log(e.target.name);  
    },
    render:function()
    {
       var premtrusted = '';
       if(this.state.primiumuser)
        premtrusted = <img src="/image/shield.png" height="22" title="This is a verified trusted service provider" style={{cursor:'pointer'}} />;
        return(<div className="hiddencontent transo" ref={function(hdiv){this.hiddendiv = hdiv}.bind(this)} onClick={this.HandleGeneralClicks}>
        <div className="appcontent">
        <div style={{ marginBottom:'20px'}}>
        <img width="150" style={{ border: '4px solid rgba(0,0,0,0.3)'}} src={this.state.profilethumb} />
        <div style={{display:'inline-block', marginLeft:'20px', paddingTop:'20px', verticalAlign:'top'}}>
        <div><p style={{display:'inline-block', marginTop:'0px'}} className="headerText">{this.state.businessname} </p>
         <div  style={{display:'inline-block', verticalAlign:'top', marginLeft:'20px'}}>{premtrusted}</div>
         </div>
           
         <p style={{color:'rgba(0,0,0,0.45)'}}>
        
         </p>
        </div>
       
        </div>
       
              
        
         <p className="headerText" >Date: <input type="date" style={{width:'200px', marginRight:'20px'}} onChange={this.handleSearchDateChange}  value={this.state.lookupdate}/>
         Service: <select  style={{width:'300px'}} onChange={this.handleSearchServiceChange}>
         {this.state.services.map(function(sv){return(<option key={sv.jobid} value={sv.jobid}>{sv.jobname}</option>)})}
         </select>
         <button onClick= {this.findAvailableTimes}>Find</button>
         
         </p>
        <h2>A list of our staff with open time slots</h2>
        
        <ul id="atime" ref={function(tl){this.timeList = tl}.bind(this)} className="timelist" style={{listStyle:'none', margin:'0px',paddingLeft:'0px', position:'relative', width:'100%', display:'table'}}>
         {  this.state.workers.map(function(at,ind){
             var intervalLength = at.endtime - at.begintime;
            
              if((at.availabletimes.length === 1 && at.availabletimes[0].endtime !== 0) || (at.availabletimes.length > 1))
              {
               
             return(<li key={ind} style={{position:'relative'}}>
              <paper-material style={{padding:'40px 10px 40px 10px'}}>
             <h3 className="wker">{at.name}</h3>
              <div style={{margin:'1px'}}>Services</div>
              
              <div>
             { at.skills.map(function(sk){
                
                 return(<div key={sk.skilid} style={{display:'inline-block', margin:'5px', padding: '5px'}}><p style={{margin:'0px'}}>{sk.skillname}</p></div>)}.bind(this))
                }
              
              
             </div>
             <div style={{borderTop:'1px solid rgba(0,0,0,0.1)'}}>
            
             {at.availabletimes.map(function(atm, ind){
                    
                    return(<div  onClick={this.handleSlotClick} key={ind} style={{display:'inline-block', margin:'5px', cursor:'pointer', padding: '10px', background:'#FF4081', borderRadius:'3px', color:'#fff'}}><p style={{margin:'0px'}}>{atm.beginhour} - {atm.endhour}</p>
               <div>
              
              <input name="starthour" type="time" type="hidden" value={atm.beginhour} />
              <input name="slotend" type="number" type="hidden" value={atm.endtime} />
               <input name="slotstart" type="number" type="hidden" value={atm.begintime} />
               <input name="workerid" type="number" type="hidden" value={at._id} />
               
             <paper-material onClick={this.preventClose} className="bkbox" class="bkbox" style={{position:'absolute', width:'200px', display:'none', height:'240px'  ,zIndex:'1000' }}>
            <input name="endmin" type="text" style={{display:'none'}} value={this.state.selectedslotendtime} />
             <form style={{height:'230px', padding:'2px 2px 10px 2px', background:'#fff'}}>
              <p>Starts at</p>
              <input type="time" value={this.state.selectedTimeStart} onChange={this.handleStartTimeChange} />
              <p>Bookables</p>
                
             <select value={this.state.seelcetedservice} onChange={this.selectedServiceChange}>
               <option default value=""> Select Service </option>
               {at.skills.map(function(sv){
                  
                  if(this.state.minstart >=0 &&(parseInt(sv.skillduration) < (this.state.selectedslotendtime - this.state.minstart))){
                      
                   return(<option key={sv.skilid} value={sv.skilid} data-duration={sv.skillduration}>{sv.skillname}</option>);
                  }
                  
               }.bind(this))}
             </select>
             <button className="plain" onClick={this.handleBook}>Save</button>
             <button className="plain" onClick={this.hideform}>Close</button>
                
             </form>
            
             </paper-material>
             </div>
                    </div>);
                    
                    
             }.bind(this))}
             </div>
             </paper-material>
             </li>)
              }
             
          }.bind(this))}
          
          
        </ul>
        
         <div id="businesscont" className="transo" style={{marginTop:'20px',width:'600px', display:'inline-block',opacity:'0'}}> 
          <ul style={{listStyle:'none', padding:'0px', margin:'0px'}}>
            {this.state.images.map(function(image,ind){
                var start = image.thumb.split(',')[0];
                return(<li key={ind} style={{marginBottom:'20px'}}>
                  <paper-material className="pmc" style={{overflow:'auto'}}>
                   <img src={start+','+image.image} width="500" alt='add or image' />
                  <div>
                  <div style={{display:'block', float:'right',padding:'5px'}}>
                  <input type="hidden" value={image.gridid} />
                   <iron-icon icon="communication:comment"></iron-icon>
                  </div>
                  </div>
                  </paper-material>
                 
                </li>);
               
            }.bind(this)) }
            
          </ul>
         </div> 
         <div className="addpart">
         <p style={{margin:'0px', display:'block', float:'left', border:'1px solid #ccc' ,borderRadius:'2PX',padding:'1px 3px 1px 3px'}}>
         <a href='#' style={{textDecoration:'none'}}>AD</a></p> <p style={{margin:'0px', display:'block', float:'right'}}><a href="#">Advertise with us</a></p>
         <img src="" />
         </div>
        </div>
        
         <paper-dialog  id="pdbook"  entry-animation="scale-up-animation"
              exit-animation="fade-out-animation">
              
             <div>
              <form onSubmit = {this.handleBookin}>
              <p><i>You are not registered with us. Therefore we require you to provide the nescesarry info so that we can place your request. To make things easier for yourself you could always <a href ="/user/register">   register</a> with us.</i></p>
              <label>Your Name</label>
               <input type="text" value={this.state.reqname} required onChange={this.handleInputChange} name="reqname" />
               <label>Your Email</label>
               <input type="email" value={this.state.reqemail} required onChange={this.handleInputChange} name="reqemail" />
                <label>Your telephone number</label>
               <input type="telephone" value={this.state.reqtel} required onChange={this.handleInputChange} name="reqtel"/>
               <label>Service requested</label>
               <input value={this.state.selectedservicename} />
               <label>Start Time</label>
               <input type="time" value = {this.state.selectedTimeStart} />
               <input type="hidden" value={this.startmin} />
                <div><paper-icon-button icon="close" onClick={this.closeBdiag}></paper-icon-button> 
                 <button style={{display:'inline-block', marginLeft:'20px'}}>Request Booking</button></div>
               
              </form>
             </div>
             
             </paper-dialog>
        
        </div>);
    }
});

ReactDOM.render(<BusinessDisplay /> , document.getElementById('businesspage'));