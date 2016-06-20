# Use desktop cursor
document.body.style.cursor = "auto"


# Import file "design"
sketch = Framer.Importer.load("imported/design@1x")


sketch.DriveMenu.x=0
sketch.Rename.visible=false
sketch.Group.visible=false
sketch.Move.visible=false
sketch.Delete.visible=false
sketch.Organizer.visible=false
sketch.Analyze.visible=false
sketch.Delete_Menu.visible=false

# Framer.Device.contentScale=0.7

mainMenu=sketch.DriveMenu.childrenWithName("MainMenu")[0]
speechBubble=mainMenu.childrenWithName("BottomOptions")[0].childrenWithName("SpeechBubble")[0]
feedback=mainMenu.childrenWithName("BottomOptions")[0].childrenWithName("Feedback")[0]
darkOverlay=sketch.DriveMenu.childrenWithName("DarkOverlay")[0]
menuIcon=sketch.DriveMenu.childrenWithName("Header3")[0].childrenWithName("MenuIcon")[0]
closeMenu=mainMenu.childrenWithName("Close1")[0]
toggleView=sketch.DriveMenu.childrenWithName("ToggleView")[0]
sunburst=sketch.DriveMenu.childrenWithName("Sunburst1")[0]

mainMenu.states.add
	slideIn:
		x: -15
	slideOut:
		x:-400

darkOverlay.states.add
	fadeIn:
		opacity: 1				
	fadeOut:
		opacity: 0
		
closeMenu.states.add
	normal:
		scale: 1
	hover:
		scale: 1.2

feedback.states.add
	popIn:
		scale:0.1
		opacity: 0
		x: 100
	popOut:
		scale:1
		opacity: 1
		x: 380
		
speechBubble.states.add
	open:
		scale: 0.8		
	close:
		scale:1		

sunburst.states.add
	analyze:
		opacity: 1
		y: -20
	organize:
		opacity: 0
		y:-90

mainMenu.states.switchInstant("slideOut")
darkOverlay.states.switchInstant("fadeOut")
feedback.states.switchInstant("popIn")
speechBubble.states.switchInstant("close")
isFeedbackOpen=false
sunburst.states.switchInstant("analyze")
inOrganizeState=false

menuIcon.onTap ->
	mainMenu.states.switch("slideIn",time:0.2,curve:"ease")
	darkOverlay.states.switch("fadeIn",time:0.2,curve:"ease")

closeMenu.onTap ->
	mainMenu.states.switch("slideOut",time:0.4,curve:"ease")
	darkOverlay.states.switch("fadeOut",time:0.4,curve:"ease")
	if isFeedbackOpen
		speechBubble.states.switch("close",time:0.1)
		feedback.states.switch("popIn",time:0.1)

closeMenu.onMouseOver (event, layer) ->
	closeMenu.states.switch("hover",time:0.2)

closeMenu.onMouseOut (event, layer) ->
	closeMenu.states.switch("normal",time:0.2)

speechBubble.onTap ->
	if isFeedbackOpen
		speechBubble.states.switch("close",time:0.1)
		feedback.states.switch("popIn",time:0.1)
	else
		speechBubble.states.switch("open",time:0.1)
		feedback.states.switch("popOut",time:0.1)
	isFeedbackOpen=!isFeedbackOpen

toggleView.onTap ->
	if inOrganizeState
		sunburst.states.switch("analyze",time:0.4)
	else
		sunburst.states.switch("organize",time:0.4)
	inOrganizeState=!inOrganizeState	