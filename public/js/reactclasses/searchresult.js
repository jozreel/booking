var SearchResult=React.createClass({
   getInitialState:function()
   { var st = document.getElementById('searchvalue').value;
       return({searchtext:st, searchtype:'',searchres:[]});
   },
   componentDidMount:function()
   {
      var st = document.getElementById('searchvalue').value;
       var type = document.getElementById('searchtype').value;
       var mp=this;
       $.ajax({
           url:'/user/search',
           dataType:'json',
           method:'POST',
           data:{searchtext:st, searchtype:type},
           beforeSend:function(){startSpinner();
               
            },
           success:function(res)
           {
               if(res.length)
                mp.setState({searchres:res})
              
               stopSpinner();
           }
       });
   
   },
   handleSearchChange:function(e)
   {
       this.setState({searchtext:e.target.value});
   },
   handleBUsinessNameClick:function(e)
   {
       var jobid ='';
       var businessid = e.target.querySelector('input').value;
        jobid = "/"+document.querySelector('#jobid').value;
       
       window.location = '/user/businesspage/'+businessid+jobid;
   },
   render:function()
   {
       return(<div><paper-material><iron-icon icon="search" style={{width:'3%'}}></iron-icon>
       <input className="nooutline" style={{marginBottom:'0px', width:'97%', border:'none', display:'inlineBlock'}} type="search" value={this.state.searchtext} onChange={this.handleSearchChange} /></paper-material>
       <div style={{margin: '20px auto'}}>
       <ul style={{listStyle:"none",marginRight:'20px'}}>
         {this.state.searchres.map(function(r,indx){return(<li key={r._id} style={{borderBottom:'1px solid #ccc', paddingBottom:'1  0px'}}>
         <span onClick={this.handleBUsinessNameClick} style={{fontSize:'16pt',color:'#1c629e',cursor:'pointer'}}>{r.businessname}<input type="hidden" value={r._id} /></span>
          <p style={{margin:'0px', color:'rgba(0,0,0,0.54)'}}>{r.street}, {r.businesstwn}, {r.country}</p>
         <p style={{margin:'0px', color:'rgba(0,0,0,0.54)'}}>Services offered</p>
         <ul style={{listStyle:'none'}}>
         {r.jobs.map(function(s)
             {
                 console.log(s);
              return(<li style={{display:'inline', marginRight:'10px' , color:'rgba(0,0,0,0.54)'}} key={s.jobid}>{s.jobname}</li>)   ;
             })}
          </ul>
         </li>);}.bind(this))}
       </ul>
       </div>
       </div>
       );
   } 
});

ReactDOM.render(<SearchResult />, document.getElementById('searchres'));