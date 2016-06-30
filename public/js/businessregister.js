var BusinessForm = React.createClass({
getInitialState:function()
{
    return({businessname:'',error:'', mainemail:'', contactname:'', contactnumber:'', street:'', businesstwn:'', country:'',servicename:'',password:'', passwordr:'',townlist:[], businesstypes:[]});
},    

render:function()
{
    return(<div className="paper user proffrom">
    <form autocomplete="off"  className="fluid" onSubmit={this.handleSubmit} >
    <label>Business name</label>
     <input type="text" placeholder="Babs Baber Shop" value={this.state.businessname} onChange={this.handleTextChange} name="businessname" />
     <label>Main Email</label>
     <input type = "email" placeholder="babsbaber@gmail.com" value={this.state.mainemail} onChange={this.handleTextChange} name="mainemail"/>
     <label>Contact Name </label>
     <input type="text" placeholder ="Jane Dorival" value={this.state.contactname} onChange={this.handleTextChange} name="contactname"/>
     <label>What type of business doo you run ?</label>
     <input type="text" list="businesstypes" placeholder ="Baber Shop" value={this.state.businesstype} onChange={this.handleServivenameChange} autocomplete="off" />
      <datalist id="businesstypes">
                      {this.state.businesstypes.map((tval,indx)=>{return(<option key={tval.serviceid}>{tval.businesstype}</option>)})}
      </datalist>
     <label>Country</label> 
     <CountrySelect url="/static/countries.json"
                  value={this.state.country}
                  onChange={this.handleTextChange}
                  name="country"/>
     
 
      <p>The town of business</p>
      <input style={{display:'none'}} name="town" />
     <input list="towns" autocomplete="off"  placeholder="eg Asgard" onChange={this.handleTextDDChange} />
     <datalist id="towns">
          {this.state.townlist.map((tval,indx)=>{return(<option value={tval.name} key={tval.nameid}>{tval.name},{tval.country}</option>)})}
     </datalist>
      <label>Street of business</label>
      <input type='text' value={this.state.street} placeholder="21 independence street" name="street" onChange={this.handleTextChange} />
      <label>Telephone number of business </label>    
      <input type='number' onBlur={this.validatePhone} value={this.state.contactnumber} placeholder="17672443211" name="contactnumber" onChange={this.handleTextChange} />
      <label>Password</label>
        <input type='password' value={this.state.password} placeholder="password" name="password" onChange={this.handleTextChange} />
       <label>Repeat Password</label>
        <input type='password' value={this.state.passwordr} placeholder="Repeat password" name="passwordr" onBlur={this.validatePassword} onChange={this.handleTextChange} />
      
     
     <button>Save</button>
    </form>
    </div>);
},
 validatePhone:function(e)
    {
        var regx = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/
        var test=regx.test(e.target.value);
        if(!test)
        {
           this.setState({error:'invalid phone'});
          
        }
        else{
            this.setState({error:''});
        }
        
    },
handleServivenameChange:function(e)
{
    var mp = this;
    this.setState({servicename:e.target.value});
    $.ajax({
           url: '/businesstype/regxpfind/'+e.target.value.trim(),
           dataType:'json',
           success:function(res)
           {
              console.log(res);
              mp.setState({businesstypes:res}) ;
           }
        });
},
handleTextChange:function(e)
{
       var name =e.target.name;
       var userobj ={}  
       userobj[name]=e.target.value;
      console.log(userobj);
      this.setState(userobj) ; 
},
handleTextDDChange:function(e)
        {   var ob = this;
            
            this.setState({town:e.target.value,businesstwn:e.target.value});
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
handleSubmit:function(e)
{
    e.preventDefault();
   var data={businessname:this.state.businessname, mainemail:this.state.mainemail, contactname:this.state.contactname,
        contactnumber:this.state.contactnumber, street:this.state.street, businesstwn:this.state.businesstwn, country:this.state.country,servicename:this.state.businesstype,
        password:this.state.password, passwordr:this.state.passwordr}
   
    if(this.state.error === '')
    {
    console.log(data);
    $.ajax({
            beforeSend:function(){
              document.getElementById('spinner').style.display='block';  
            },
             url:'/user/registerbusiness/',
             type:'POST',
             data:data,
             success:function(res)
             {
                  
                      document.getElementById('spinner').style.display='none';  
              }
            });
            
    }
    
},
validatePassword:function(e)
{
    if(e.target.value !== this.state.password)
    {
        this.setState({error:'Passwords do not match'});
    }
    else if(this.state.password ==='' || this.state.passwordr === '')
    {
        this.setState({error:'Passwords cannot be blank'});
        
    }
    else
    {
        this.setState({error:''});
    }
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
var EditBusinessPage=React.createClass({
    render:function()
    {
        var userid = document.getElementById('_id');
    }
})


ReactDOM.render(<BusinessForm />, document.getElementById('regis'));