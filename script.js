document.getElementById('closeSidebar').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
    this.style.display = 'none';
    document.getElementById('openSidebar').style.display = 'block';
  });
  
  document.getElementById('openSidebar').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.add('open');
    this.style.display = 'none';
    document.getElementById('closeSidebar').style.display = 'block';
  });
  