var ServiceSearch = React.createClass({
    getInitialState:function()
    {
        return({services:[],servicename:''});
    },
    handlServiceChange:function(e)
    {
         var mp = this;
       
        this.setState({servicename:e.target.value});
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
     handleSearchSubmit:function(e)
    { 
        // e.preventDefault();
        var opt = this.sinpt.querySelector('option[value="'+this.state.servicename+'"]');
        if(opt !==null)
          var v = this.sinpt.querySelector('option[value="'+this.state.servicename+'"]').dataset.value;
         window.location = '/user/searchresults/'+this.state.servicename+'/service';
        
    },   
    render:function(){
        return(
            <div className="left">
           <div className="sbform">
            <div className="center">
            <h3>Find It, Reserve it</h3>
            <input className="binput" type="text" placeholder="Search services provider" />
            <input type="text" list="services" value ={this.state.servicename} onChange={this.handlServiceChange} placeholder="Search by service name"   />
            <datalist id="services" ref={function(si){this.sinpt = si}.bind(this)}>
                      {this.state.services.map((tval,indx)=>{return(<option data-value={tval.serviceid} value={tval.servicename} key={tval.serviceid}></option>)})}
            </datalist>
            <paper-icon-button onClick={this.handleSearchSubmit}  style={{background:'#6b8c83', borderRadius:'50%'}}  icon="search" ></paper-icon-button>
            </div>
            </div>
            <p><a href="/user/businessregistrationpage">Register your buisness with us. Quick and easy </a></p>
            </div>
        )
    }
    
});
var SignUp = React.createClass({
    getInitialState:function(){
      return{email:'', fullName:'', password:'',passwordr:'', sex:'', birthday:'', error:''}  
    },
    handleEmailChange:function(e)
    {
       
        this.setState({email:e.target.value});
    },
     handleNameChange:function(e)
    {
        this.setState({fullName:e.target.value});
    },
     handlePasswordChange:function(e)
    {
        this.setState({password:e.target.value});
    },
     handlePasswordrChange:function(e)
    {
        this.setState({passwordr:e.target.value});
       
        
    },
    handleSexChange:function(e)
    {
        this.setState({sex:e.target.value});
    },
    handleBdayChange:function(e)
    {   
        this.setState({birthday:e.target.value});
    },
    handleSubmit:function(e)
    {
        e.preventDefault();
        var email = this.state.email.trim();
        var fullName = this.state.fullName.trim();
        var password = this.state.password.trim();
        var sex = this.state.sex.trim();
        var passwordr = this.state.passwordr.trim();
        var bday = e.target.querySelector('paper-input[type="date"]').value;
        var fd = {email:email, fullname:fullName, password:password, sex:sex, passwordr:passwordr, birthday:bday}
        console.log(password,passwordr);
        if(password === passwordr)
        {
        this.setState({error:""});
        $.ajax({
            type:'POST',
            url:'/user/register',
            data:fd,
            dataType:'json',
            success:function(result)
            {
                window.location='home/success';
            }
        });
        }
        else{
           
            this.setState({error:"Passwords do not match"});
        }
    },
    handleLeave:function(e)
    {
        if(this.state.password !== this.state.passwordr)
          this.setState({error:'Passwords do not match'});
        else
           this.setState({error:''});
    },
    emailLeave:function(e)
    {
        var regx = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
        var test = regx.test(e.target.value);
        if(!test)
          this.setState({error:'Invalid email'})
        else
          this.setState({error:''});
    }
    
    ,
    render:function(){
        return(
            
            <form onSubmit={this.handleSubmit}>
            <h3>New user registration</h3>
            <input type="email" placeholder="Email" onChange={this.handleEmailChange} required onBlur={this.emailLeave}/>
            <input type="text" placeholder="Full Name" onChange={this.handleNameChange} required />
            <input type="Password" placeholder="Password"  onChange={this.handlePasswordChange} required />
            <input type="Password" placeholder="Repeat Password" onChange={this.handlePasswordrChange} onBlur={this.handleLeave} required />
            <select required>
               <option value="" default onChange={this.handleSexChange} >Select Sex</option>
                <option value="M"  >Male</option>
                <option value="F"  >Female</option>
            </select>
            <div style={{background:'#fff', borderRadius:'4px', marginBottom:'10px', border: '1px solid #FFF3E0', paddingLeft:'5px'}}>
            <paper-input label="Birthday" type="date" required ></paper-input>
            </div>
            <input type="submit" value="Sign Up" style={{cursor:'pointer'}}  />
              <p style={{color:'#fe464e'}}>{this.state.error}</p>
         </form>
       
         
          
        );
    }
});

var Login = React.createClass({render:function()
    {
   return(
        <form meethod="post">
           <h3>SIgn in</h3>
            <input className="binput" type="text" placeholder="username" />
            <input className="binput" type="password" placeholder="password" />
            <paper-button style={{background:'#6b8c83'}} raised>submit</paper-button>
           </form>
   ); 
   }
});
var LandingPage = React.createClass({
    render:function(){
        return(
            <div>
            <ServiceSearch />
            <div className="singup">
            <SignUp />
            <Login />
            </div>
            </div>
        )
    }
})
 ReactDOM.render(<LandingPage />, document.getElementById('landing'));
