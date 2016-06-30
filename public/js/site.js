$('document').ready(function()
{
    document.getElementById('cyear').innerHTML = new Date().getFullYear().toString();
});

function stopSpinner()
{
     document.getElementById('spinner').active=false;
     document.getElementById('spinner').style.display='none';
}
function startSpinner()
{
     document.getElementById('spinner').active=true;
     document.getElementById('spinner').style.display='block';
}
function showToast(word)
{
     document.getElementById('toast').innerHTML=word;
                   
     document.getElementById('toast').open();
}
function showMessage(msg)
{
    document.getElementById('messageDialog').querySelector('p').innerHTML=msg;
    document.getElementById('messageDialog').open();
}