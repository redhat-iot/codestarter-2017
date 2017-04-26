<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<title>Red Hat Eurotech IoT Demo</title>
</head>

<body>
<h1>Red Hat Eurotech IoT Codestarter demo</h1>

<div id="status">
	<%
		String status = request.getParameter("status");
		if (status != null) {
			%> <span style="background-color: green; color: white;">Status: <code><%= status %></code></span> <%
		}
	%>
</div>
<hr>
<form action="/api/iot/publish" method="post">
	<div>
		<label for="topic">Topic</label>
		<input name="topic" id="topic" value="/some/mqtt/topic">
	</div>
	<div>
		<label for="message">Message</label>
		<input name="message" id="message" value="Hello World!">
	</div>
	<div>
		<button>Publish!</button>
	</div>
</form>

</body>

</html>