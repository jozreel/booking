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
        return{availabletimes:[], services:[],images:[], primiumuser:true, selectedService:'', lookupdate:today,opentimes:[]}
    },
    componentDidMount:function()
    {
       
         this.findAvailableTimes();
      
    },
    findAvailableTimes:function()
    {
      
         var bp = this;
           console.log(bp.state.lookupdate);
         var id = document.getElementById('businessid').value;
        $.ajax({
          beforeSend:function()
          {
              startSpinner();
          },
          url:"/user/getavailabletimes/"+id+"/"+bp.state.lookupdate,
          success:function(res)
          {
              
              if(res.success !==  false)
              {
            //  var openTime = res.opentime;
              
                console.log(res);
                bp.setState({_id:id,availabletimes:res.availabletimes,services:res.services,dayisspecial:res.dayisspecial,dooropener:res.dooropener, doorcloser:res.doorcloser, opentimes:res.opentimes,profilethumb:res.profilethumb, businessname:res.businessname});
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
    var starttimeinpt = e.target.querySelector('input[name="starthour"]');
     var ssst =e.target.querySelector('input[name="slotstart"]').value;
      if(!this.state.dayisspecial)
      {
        this.state.opentime = this.state.opentimes[0].open;
        this.state.closetime = this.state.opentimes[0].close;
      }
      else
      {
          var slh= '01/01/2016 '+starttimeinpt.value;
         for(var sd =0; sd< this.state.opentimes.length; sd++) 
         {
             console.log(this.state.opentimes[sd].open, this.state.opentimes[sd].close, starttimeinpt.value)
             var oh = '01/01/2016 '+this.state.opentimes[sd].open;
             var ch = '01/01/2016 '+this.state.opentimes[sd].close;
             
             console.log(Date.parse(slh), Date.parse(oh),Date.parse(ch),'ppkoko');
           if(Date.parse(slh) >= Date.parse(oh) && Date.parse(slh) < Date.parse(ch) )
           {
              this.state.opentime = this.state.opentimes[sd].open;
              this.state.closetime = this.state.opentimes[sd].close;
           }
         }
      }
      
      console.log(this.state.opentime, 'aot');
       var left = e.clientX-$('#atime').offset().left;
       var tl = document.querySelector('#atime');
        var top =  80;
        var slotleft = e.target.parentNode.offsetLeft;
       // var leftmin = left - slotleft;
       var olftdiff = parseInt(left)-parseInt(slotleft);
        var pm = tl.querySelector('paper-material');
       
        
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
            
            this.setState({selectedTimeStart:stm, minstart:rms,bdd:true});
            this.forceUpdate();
            
        }
        }
    },
    handleStartTimeChange:function(e)
    {
        var pmaterial = e.target.parentNode.parentNode;
       
       
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
           
            pmaterial.style.left = diff+'px';
           
           
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
     //  e.preventDefault();
    
     e.target.parentNode.parentNode.parentNode.style.display="none";
     
    },
    HandleGeneralClicks(e)
    {
         
         if(this.state.bdd)
         {
           this.setState({bdd:false});
           document.querySelector('.bdd').style.display="none";
           
         }
         // this.setState({bdd:false});
       
    },
    handleBook(e)
    {
        console.log(this.state.dooropener, this.state.doorcloser);
        if(this.state.selectedService !== '') 
        {
            var starttimearr = this.state.dooropener.split(':');
console.log(this.state,'ppppppppp');
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
           document.querySelector('.bdd').style.display='none';
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
        var ati= this;
       console.log({begintime:this.state.minstart, email:this.state.reqemail, _id:this.state._id, 
              contactnumber:this.state.reqtel, enndtime:this.state.minend, name:this.state.reqname, endhour:this.state.endhour, starthour:this.state.selectedTimeStart,
             date:this.state.lookupdate    
        });
      e.preventDefault();
      $.ajax({
          method:'POST',
          dataType:'json',
          data:{begintime:this.state.minstart, email:this.state.reqemail, _id:this.state._id, 
              contactnumber:this.state.reqtel, enndtime:this.state.minend, name:this.state.reqname, endhour:this.state.endhour, starthour:this.state.selectedTimeStart,
             date:this.state.lookupdate ,slottodel:this.state.clickedSlotStartHour
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
           
         <p style={{color:'rgba(0,0,0,0.45)'}}>Today's Opening hours 
         {this.state.opentimes.map(function(ot,k){
             return  <paper-button><time>{ot.open}</time> - <time>{ot.close}</time></paper-button> 
         })}
         </p>
        </div>
       
        </div>
         <paper-material style={{padding:'40px 10px 40px 10px'}}>
         <p className="headerText" >Available Times: <input type="date" style={{width:'200px'}} onChange={this.handleSearchDateChange}  value={this.state.lookupdate}/>
         <button onClick={this.findAvailableTimes} style={{marginLeft:'20px', height:'40px', marginTop:'0px', paddingTop:'0px'}}>Find for Date</button>
         </p>
        <ul id="atime" ref={function(tl){this.timeList = tl}.bind(this)} className="timelist" style={{listStyle:'none', margin:'0px',paddingLeft:'0px', position:'relative', width:'auto', display:'table'}}>
         {  this.state.availabletimes.map(function(at,ind){
             var intervalLength = at.endtime - at.begintime;
              
             return(<li key={ind} style={{position:'relative'}}>
             <div  onClick={this.handleSlotClick} style={{background: 'rgba(0,128,0,0.45)', cursor:'pointer', borderRadius:'3px', height:'80px', width:intervalLength}}>
              <input name="starthour" type="time" style={{display:'none'}} value={at.beginhour} />
              <input name="slotend" type="number" style={{display:'none'}} value={at.endtime} />
               <input name="slotstart" type="number" style={{display:'none'}} value={at.begintime} />
               
              </div>
             <p style={{color:'rgba(0,0,0,0.45)'}} >{at.beginhour} - {at.endhour}</p>
             
            
             </li>)
             
          }.bind(this))}
          
          <paper-material onClick={this.preventClose} className="bkbox" class="bdd" style={{position:'absolute', width:'200px', display:'none', height:'240px'  ,zIndex:'1000' }}>
            <input name="endmin" type="text" style={{display:'none'}} value={this.state.selectedslotendtime} />
             <form style={{height:'230px', padding:'2px 2px 10px 2px', background:'#fff'}}>
              <p>Starts at</p>
              <input type="time" value={this.state.selectedTimeStart} onChange={this.handleStartTimeChange} />
              <p>Bookables</p>
                
             <select value={this.state.seelcetedservice} onChange={this.selectedServiceChange}>
               <option default value=""> Select Service </option>
               {this.state.services.map(function(sv){
               
                   console.log(this.state.selectedslotendtime,'pp');
                  if(this.state.minstart >0 &&(parseInt(sv.jobduration) < (this.state.selectedslotendtime - this.state.minstart))){
                      
                   return(<option ke={sv.jobid} value={sv.jobid} data-duration={sv.jobduration}>{sv.jobname}</option>);
                  }
                  
               }.bind(this))}
             </select>
              <div style={{position:'relative', display:'inline-block', marginRight:'20px'}} className="round">
              <iron-icon onClick={this.hideform} icon="close"></iron-icon><paper-ripple></paper-ripple></div>
             <div style={{position:'relative',display:'inline-block'}}  className="round">
             <iron-icon onClick={this.handleBook} icon="check"></iron-icon><paper-ripple>
             </paper-ripple></div>    
             </form>
            
             </paper-material>
        </ul>
         </paper-material>
         <div id="businesscont" className="transo" style={{marginTop:'20px',width:'600px', display:'inline-block',opacity:'0'}}> 
          <ul style={{listStyle:'none', padding:'0px', margin:'0px'}}>
            {this.state.images.map(function(image){
                var start = image.thumb.split(',')[0];
                return(<li style={{marginBottom:'20px'}}>
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