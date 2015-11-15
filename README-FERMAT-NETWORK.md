#Fermat Network Rendering

In this document, we describe how the Fermat.org site will render the Fermat Network. How the data flows from the server to browsers in order to produce the visualizations.

As the Fermat Network is a complex creature, many different views are going to be provided in order to navigate through this complexity.

## View List

1. **Online Node Network** : This view provides a geo-localized view of online Nodes in the Fermat Network.

2. **Nodes and connected Network Clients** : In this view, a single Network Node is present, and all connected Network Clients are rendered.

3. **Node Catalog** : This is a geo-localized view of all nodes, both online and offline, present on the distributed Node Calaog.

4. **Actor Catalog** : This is a geo-localized view of all actors, both online and offline, present on the distributed Actor Calaog.

5. **Network Services** : This view shows all online network services online on one Network Client. When the Network Service is an Actor Network Service, it also shows the actors associated with each of them.

6. **Wallets** : This view show all wallets and their type linked to one Network Client. Each wallet shows its balance and currency. 

7. **Social Network** : This view shows the connections between Actors within the system. 

8. **Private Networks** : This view shows the private networks created by users.


## Basic Elements

In these views, users will enter in a free-moving space where they can see sprites and lines interconecting them.

### Sprite Categories

- **Network Nodes** : Denoted by a sprite for each type of node and the operating system. It's a niche where several Network Clients will connect and will work as intermediaries between each other. The type of nodes are: home computer, server, smart phone, tablet, etc. Operating systems might be: Windows, Linux, OSx, Android, etc.

- **Network Clients** : Denoted as a sprite for each type of device and its operating system. Device type might be: smart phone, pc, tablet, etc. 

- **Network Services** : Denoted with a sprite for each type: Network Service or Actor Network Service. A Network Services connects with its counterpart in another device.
    
- **Actors** : Denoted with a sprite for each Actor Type (Developer, Crypto Broker, etc). 

- **Wallets** : Denoted with a sprite for each Wallet Type.

As it seems, there are several sprite categories. 

### Types of Relationships

- **Connected to** : For example, a Network Client is _connected to_ a Network Node.

- **Running at** : For example, a Network Service is _running at_ a Network Client.

- **Living at** : For example, an Actor is _living at_ a Network Client.

- **Installed at** : For example, a Wallet is _installed at_ a Network Client.

- **Interconnected** : For example, an Actor is _interconnected_ with another Actor when one of them sent to the other a _connection request_ and the other party accepted it.

All relationships are rendered with lines, but depending on their category different techniques (arrow, dots, dashes, etc.) are applied to distinguish between each other. 

## User Experience

In this section we describe what exactly is expected in each view.

### Online Network Nodes
 
This view will render all the online Network Nodes. 



# MIGUEL: VOY POR ACA


##The challenge
As the P2P is expected to be so large, and being updated and larger every time, it's not feasible
to obtain the whole P2P data in a single json document, so and ajax call is not possible because
it expects a complete json document to be received, and we need a continuous data traffic to 
render the network in real-time with the server.

##The solution (deprecated)
*This block is not useful anymore as it was said the client and server needed bidirectional
communication*

So, as a continuous data sending is necessary, we are talking about a *stream*.

Luckily, there is a web interface that can support the stream paradigm, the **Server-Sent Events**
which is described at the W3C (http://www.w3.org/TR/eventsource).

Basically what the client will do is something like:

```javascript
var source = new EventSource('updates.cgi');
source.onmessage = function (event) {
  alert(event.data);
};
```

Where `updates.cgi` script will send the data with the `text/event-stream` MIME type (the data is sent with UTF-8 encoding).

So, we are talking about query once and just respondt to the event everytime it's triggered. Just
to be sure, we will add to the request the header `Cache-Control: no-cache` to avoid any
caching mechanism.

##Server-side process(deprecated)
*This block is not useful anymore as it was said the client and server needed bidirectional
communication*

###`text/event-stream` structure
The basic structure of the message the server must send is:

```
id: [IDString]
data: [dataString0]
data: [dataString1]
...
data: [dataStringN]
[blank_line]
```

- Note that at the end of each line must be a line break.
- *dataString* is the actual data that must be sent from the server, the *data* field can be sent
multiple times, resulting that the client will have an array of all of them.
- *IDString* is a non-empty string which will work to diferenciate between sends. The server will
get the last ID sent in each request, so it's a way to control which client received what.

###Data structure
*To be completed...*

##Client-side process