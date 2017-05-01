<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<title>Red Hat Eurotech IoT Demo</title>
</head>

<body>
<h1>Red Hat Eurotech IoT Codestarter demo</h1>
<ul>
	<em>BROKER_HOST: <code><%= System.getenv("BROKER_HOSTNAME")%></code></em>
	<em>BROKER_PORT: <code><%= System.getenv("BROKER_PORT")%></code></em>
</ul>
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
		<input name="topic" id="topic" value="<%= System.getenv("BROKER_TOPIC_PREFIX") %>">
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
