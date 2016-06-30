var UserForm =React.createClass({
    getInitialState:function(){
        
        return({alias:'', fullnme:'',password:'', passwordr:'',profilethumb:'/image/lady.png', country:'US',part:'PI', street:'',sex:'',email:'',backupemail:'',town:'',mobile:'', error:'',mobilelist:[]});
    },
    componentDidMount:function(){
       
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
    handleListClickAddress:function(e)
    {
         
        this.setState({part:'ADDR'});
         $("#sidelist>ul>li.active").removeClass('active');
         $(e.target).closest('li').addClass('active');
         document.getElementById('formholder').style.opacity='1';
    },
    handleBlur:function(e)
    {    
         //$(e.target).closest('p').css("border-bottom", "none" );
    },
    handleListClickPI:function(e)
    {
         
         this.setState({part:'PI'});
         $("#sidelist>ul>li.active").removeClass('active');
         $(e.target).closest('li').addClass('active');
         document.getElementById('formholder').style.opacity='1';
    },
    handleClickSelf:function()
    {
        document.getElementById('uf').style.height='650px';
        
    },
    handleClickPhone:function()
    {
        document.getElementById('ph').style.height='200px';
        
    },
    handleListClickEmail:function(e)
    {    
          this.setState({part:'EP'});
          $("#sidelist>ul>li.active").removeClass('active');
          $(e.target).closest('li').addClass('active');
          document.getElementById('formholder').style.opacity='1';
          
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
               
                
                cur.setState({profilepiclarge:imageobject});
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
        e.preventDefault();
      var idata={largeimage:this.state.profilepiclarge, profilethumb:this.state.profilethumb,_id:this.state._id}
     
      $.ajax({
          url:'/user/saveprofileimage',
          dataType:'json',
          type:'POST',
          data:JSON.stringify(idata),
          success:function(res)
          {
              console.log(res);
          }
      });
    },
    handlePhoneSubmit:function(e)
    {
        e.preventDefault();
        $.ajax({
          url:'/user/savemobile',
          dataType:'json',
          type:'POST',
          data:{tel:this.state.mobile,_id:this.state._id},
          success:function(res)
          {
              console.log(res);
          }
      });
    },
    handleSubmitCountry:function(e)
    {
     e.preventDefault();
     var data = {country:this.state.country, street:this.state.street,town:this.state.town,_id:this.state._id}  
     $.ajax({
           url:'/user/updateuser',
            dataType:'json',
            type:'POST',
            data:data,
            success:function(res)
            {
                console.log(res);
            } 
     });
    },
    handleInputChange:function(e)
    {
       name =e.target.name;
       var userobj ={}
       userobj[name]=e.target.value;
      console.log(userobj);
      this.setState(userobj) ; 
    },
    validatePhone:function(e)
    {
        var regx = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/
        var test=regx.test(e.target.value);
        if(!test)
        {
           this.setState({error:'invalid phone'});
          
        }
        
    },
    handleInfoSubmit:function(e)
    {  e.preventDefault();  
        var infobj = {};
        infobj.fullname = this.state.fullname;
        infobj.img = this.state.imagechange ? this.state.img : '';
        infobj.birthday = this.state.birthday;
        infobj.sex = this.state.sex;
        infobj._id = this.state._id;
        infobj.alias = this.state.alias;
        $.ajax(
            {
            beforeSend:function(){},
            url:'/user/updateuser',
            dataType:'json',
            type:'POST',
            data:infobj,
            success:function(res)
            {
                console.log(res);
            }
            }
        );
    },
    handleEmailPassSubmit:function(e)
    {   e.preventDefault();
         var data = {email:this.state.email,backupemail:this.state.backupemail,_id:this.state._id}  
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
            beforeSend:function(){},
            url:'/user/updateuser',
            dataType:'json',
            type:'POST',
            data:data,
            success:function(res)
            {
                console.log(res);
            }
            }
        );
        
    },
    render:function(){
        
         var formtext = '';
         
            switch(this.state.part)
            {
                case 'PI':
                
                formtext = <div><p style={{fontSize:'16pt', color:'#294b77'}}>Tell us more about yourself <button onClick={this.handleClickSelf}>...</button></p><div id="uf" className="transh" style={{display:'inline-block', height:'0px', overflow:'hidden'}}>
                <form method="POST" className="fluid" onSubmit={this.handleSubmitImage}>
                  <p>Profile Picture</p>
                  
                  <div style={{position:'relative', width:'150px'}}><canvas  style={{display:'none'}} id="canv"></canvas> <img className="sqavatar" width="150" style={{position:'absolute', top:'0px', opacity:'0'}} id="pimg" />
                  <img className="sqavatar" src={this.state.profilethumb} width="150" id="ppic" />
                 
                  </div>
                   
                  <input type="file"  onChange={this.handleImageChange} style={{opacity:'0.6' }}/>
                   <img src='' width='480' id="invimg" style={{position:'absolute', opacity:'0', zIndex:'-1'}} />
                  <button>Save</button>
                </form>
                <form method="POST" className="fluid" onSubmit={this.handleInfoSubmit} >
                 <p>Full Name</p>
                  <input type="text" value ={this.state.fullname} onChange={this.handleInputChange} name="fullname"  />
                  <p>A name you are known as</p>
                  <input type="text" value ={this.state.alias} onChange={this.handleInputChange} name="alias" />
               
                  <select required name="sex" value={this.state.sex} onChange={this.handleInputChange}>
                  <option value="" default >Select Sex</option>
                  <option value="M"  >Male</option>
                  <option value="F"  >Female</option>
                  </select>
                  <p>Birthday</p>
                  <input type="date" required name="date" onChange={this.handleInputChange} value={this.state.birthday} name="birthday"/>
                  
                   <button>Save</button>
             </form>
             </div>
             <div>
              <p style={{fontSize:'16pt', color:'#294b77'}}>Add some numbers so you can be contacted <button onClick={this.handleClickPhone}> <iron-icon icon="add"></iron-icon></button></p>
              <form className="fluid transh" onSubmit={this.handlePhoneSubmit} style={{display:'inline-block', height:'0px', overflow:'hidden'}}  id="ph">
                 
                  <p>Phone No.</p>
                  <input type="number" className="num" value={this.state.mobile}  onChange={this.handleInputChange} name="mobile" onBlur={this.validatePhone} />
                 
                  <button>Save</button>
             </form>
             
            
             <p>Mobile Phones</p>
            <ul className="text">
               {this.state.mobilelist.map(function(lv,indx){ if(lv !== null) return <li key={indx}>{lv}</li>})}
            </ul>
            
             </div>
             </div>
             
             break;
             case 'ADDR':
               formtext = <form onSubmit={this.handleSubmitCountry} className="fluid"> <p>Country</p>
                <CountrySelect url="/static/countries.json"
                  value={this.state.country}
                  onChange={this.handleInputChange}
                  name="country"
                  />
                  <p>Street</p>
                  <input type="text" placeholder='Street'  onChange={this.handleInputChange} value= {this.state.street} name="street" />
                   <p>Town</p>
                  <input type="text" placeholder='town'  onChange={this.handleInputChange} value= {this.state.town} name="town" />
                  <button>Save</button>
                  </form>
             break;  
              case 'EP':
                    formtext = <form className="fluid" onSubmit={this.handleEmailPassSubmit}>
                  <p>Email</p>
                  <input type="email" placeholder='email'  onChange={this.handleInputChange} value= {this.state.email} name="email"/>
                   <p>Change password</p>
                  <input type="password" placeholder='Password'  onChange={this.handleInputChange} value= {this.state.password} name="password" />
                  <input type="password" placeholder='Repeat Password'  onChange={this.handleInputChange} value= {this.state.passwordr} name="passwordr" />
                  <p>Backup email</p>
                  <input type="email" placeholder='backupemail'  onChange={this.handleInputChange} value= {this.state.backupemail}  name="backupemail" />
                  <button>Save</button>
                  </form>
             break;  
            }
            
          
        return(
           <div  id="sidelist">
            <ul className="left profilelist">
           <li key={1} onClick={this.handleListClickPI} onBlur={this.handleBlur} >
           <iron-icon style={{color:'#fe464e'}} icon="communication:contacts"></iron-icon> <p>Contact and Info</p>
           </li>
           <li key={2} onClick={this.handleListClickAddress}>
           <iron-icon style={{color:'#d9d92b'}} icon="maps:person-pin-circle"></iron-icon><p>Address</p>
           </li>
           <li key={3} onClick={this.handleListClickEmail}>
           <iron-icon style={{color:'#5a7840'}} icon="communication:mail-outline"></iron-icon><p>Email and Passwords</p>
           </li>
           </ul>
            <div className="user paper profform transo" style={{opacity:0}} id="formholder" >
               {formtext}
            </div>
            </div>
            );
        
       
                 
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
var SideList = React.createClass({
    handleClickChange:function(e)
    {
     
    },
    render:function()
    {
        return(<ul className="left profilelist">
        <li key={1}>
          <iron-icon icon="communication:contacts"></iron-icon> <a href="#">Contact and Info</a>
        </li>
        <li key={2} onClick={this.handleClickChange}>
          <iron-icon icon="maps:person-pin-circle"></iron-icon><a href="#">Address</a>
        </li>
        </ul>
        );
    }
});

var EditProfilePage = React.createClass({
    render:function(){
        var userId = document.getElementById('_id').value;
       return( <div>
        
        <UserForm  data={{username:'jozreel', source:"/user/findbyid/"+userId}} />
        </div>);
    }
});

ReactDOM.render(<EditProfilePage />, document.getElementById('profile'));