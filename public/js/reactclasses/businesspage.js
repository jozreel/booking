var BusinessDisplay = React.createClass({
    getInitialState:function()
    {
        return{availabletimes:[], services:[],images:[], primiumuser:true, selectedService:''}
    },
    componentDidMount:function()
    {
        var bp = this;
         var id = document.getElementById('businessid').value;
      $.ajax({
          beforeSend:function()
          {
              startSpinner();
          },
          url:"/user/getavailabletimes/"+id,
          success:function(res)
          {
              var openTime = res.opentime;
               console.log(res);  
           
                bp.setState({availabletimes:res.availabletimes,services:res.services,closetime:res.closetime, opentime:res.opentime,profilethumb:res.profilethumb, businessname:res.businessname});
            
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
              var openTime = res.opentime;
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
       var left = e.clientX-$('#atime').offset().left;
        var top =  60;
      
        var pm =e.target.parentNode.querySelector('paper-material');
       
        var starttimeinpt = e.target.parentNode.querySelector('input[name="starthour"]');
          
        if(starttimeinpt)
        {
          var  starttime = starttimeinpt.value;
        
        var form  = e.target.parentNode.querySelector('form');
        if(form)
          form.reset();
        if(pm)
        { 
           // pm.classList.remove('notShown');
            pm.style.height='0px';
           
           console.log(pm);
            
            pm.style.left = left+'px';
            pm.style.top='60px';
           
            pm.style.height='240px';
            pm.style.display = 'block';
            
             //pm.classList.add('shown');
            var minstart  = left;
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
           if(rhour <10) 
             rhour = '0'+rhour;
            rmin =parseInt(remain);
            
            if(remain < 10)
              rmin = '0'+parseInt(remain);
            var stm = rhour+':'+rmin;
            
            this.setState({selectedTimeStart:stm, minstart:minstart,bdd:true});
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
     console.log( e.target.parentNode.parentNode.parentNode);
     e.target.parentNode.parentNode.parentNode.style.display="none";
     
    },
    HandleGeneralClicks(e)
    {
        console.log(this.state.bdd);
         if(this.state.bdd)
         {
           this.setState({bdd:false});
           document.querySelector('.bdd').style.display="none";
           
         }
         // this.setState({bdd:false});
       
    },
    handleBook(e)
    {
        if(this.state.selectedService !== '')
        {
           var endbk = parseInt(this.state.minstart)+ parseInt(this.state.selectedDuration);
          
           this.setState({minend:endbk});
           document.getElementById('pdbook').open();
           document.querySelector('.bdd').style.display='none';
           
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
      $.ajax({
          method:'POST',
          dataType:'json',
          data:{begintime:this.state.minstart, email:this.state.reqemail, _id:this.state._id, 
              contactnumber:this.state.reqtel, enndtime:this.state.minend, name:this.state.reqname, starthour:this.state.selectedTimeStart},
          url:'/user/fillSlot',
          beforeSend:function(){
              startSpinner();
          },
          success:function(res)
          {
             stopSpinner();
             if(res.success)
             {
               showToast('Your request has been sent please await confirmation via email or telephone');
                document.getElementById('pdbook').close();
             }
          }
          
      });
     
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
           
         <p style={{color:'rgba(0,0,0,0.45)'}}>Today's Opening hours <paper-button><time>{this.state.opentime}</time> - <time>{this.state.closetime}</time></paper-button> </p>
        </div>
       
        </div>
         <paper-material style={{padding:'40px 10px 40px 10px'}}>
         <p className="headerText" >Available Times Today</p>
        <ul id="atime" ref={function(tl){this.timeList = tl}.bind(this)} className="timelist" style={{listStyle:'none', margin:'0px',paddingLeft:'0px', position:'relative', width:'auto', display:'table'}}>
         {this.state.availabletimes.map(function(at,ind){
             var intervalLength = at.endtime - at.begintime;
              
             return(<li  onClick={this.handleSlotClick} key={ind} style={{position:'relative', background: 'rgba(0,128,0,0.45)', cursor:'pointer', borderRadius:'3px', height:'60px', width:intervalLength}}>
            
              <input name="starthour" type="time" style={{display:'none'}} value={at.beginhour} />
            
             <p style={{padding:'20px', color:'rgba(0,0,0,0.45)'}} >{at.beginhour} - {at.endhour}</p>
             <paper-material className="bkbox" class="bdd" style={{position:'absolute', width:'200px', display:'none', height:'240px', top:'60px',zIndex:'1000' }}>
                <input name="endmin" type="text" style={{display:'none'}} value={at.endtime} />
             <form style={{height:'230px', padding:'2px 2px 10px 2px', background:'#fff'}}>
              <p>Starts at</p>
              <input type="time" value={this.state.selectedTimeStart} onChange={this.handleStartTimeChange} />
              <p>Bookables</p>
                
             <select value={this.state.seelcetedservice} onChange={this.selectedServiceChange}>
               <option default></option>
               {this.state.services.map(function(sv){
                console.log(sv.jobduration ,at.endtime  , this.state.minstart,'jefe');
                  
                  if(this.state.minstart >0 &&(sv.jobduration < (at.endtime - this.state.minstart))){
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
            
             </li>)
             
          }.bind(this))}
        </ul>
         </paper-material>
         <div id="businesscont" className="transo" style={{marginTop:'20px',width:'600px', display:'inline-block',opacity:'0'}}> 
          <ul style={{listStyle:'none', padding:'0px', margin:'0px'}}>
            {this.state.images.map(function(image){
                return(<li style={{marginBottom:'20px'}}>
                  <paper-material className="pmc" style={{overflow:'auto'}}>
                   <img src= {image.thumb} width="200" alt='add or image' />
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