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

#Accces
mainMenu=sketch.DriveMenu.childrenWithName("MainMenu")[0]
mainMenu.visible=true
speechBubble=mainMenu.childrenWithName("BottomOptions")[0].childrenWithName("SpeechBubble")[0]

feedback=mainMenu.childrenWithName("BottomOptions")[0].childrenWithName("Feedback")[0]

darkOverlay=sketch.DriveMenu.childrenWithName("DarkOverlay")[0]
darkOverlay.visible=true
menuIcon=sketch.DriveMenu.childrenWithName("Header3")[0].childrenWithName("MenuIcon")[0]

closeMenu=mainMenu.childrenWithName("Close1")[0]
toggleView=sketch.DriveMenu.childrenWithName("ToggleView")[0]
analyzeLabel=toggleView.childrenWithName("AnalyzeLabel")[0]
analyzeLabel.visible=true
organizeLabel=toggleView.childrenWithName("OrganizeLabel")[0]
sunburst=sketch.DriveMenu.childrenWithName("Sunburst1")[0]

wholeUsage=sketch.DriveMenu.childrenWithName("WholeUsage")[0]
wholeUsageColor=wholeUsage.children[1]
wholeUsageLabel=wholeUsage.children[0]
usageDetailLabels=[]
usageDetailColors=[]
for i in [1..6]
	id="UsageDetail"+i
	usageDetail=sketch.DriveMenu.childrenWithName(id)[0]	
	usageDetailLabel=usageDetail.children[0]
	usageDetailLabels.push(usageDetailLabel)
	usageDetailColor=usageDetail.children[1]
	usageDetailColors.push(usageDetailColor)
	

subheader=sketch.DriveMenu.childrenWithName("Subheader1")[0]
sortByMenu=subheader.childrenWithName("SortByMenu1")[0]
sortByMenu.visible=false
sortByButton=subheader.childrenWithName("SortByBar1")[0].childrenWithName("SortButton1")[0]
subheader.visible=true

operations=sketch.DriveMenu.childrenWithName("Operations1")[0]
operations.visible=true;
dataArea=sketch.DriveMenu.childrenWithName("DataArea1")[0]
dataArea.visible=true;




#States
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

analyzeLabel.states.add
	analyze:
		y:200
		scale:1
	organize:
		y:10
		scale:1
	hover:
		scale: 1.1
	normal:
		scale:1	

organizeLabel.states.add
	analyze:
		y:20
		scale:1		
	organize:
		y:200
		scale:1
	hover:
		scale: 1.1
	normal:
		scale:1	

sunburst.states.add
	analyze:
		opacity: 1
		y: -20
	organize:
		opacity: 0
		y:-90
				
wholeUsageLabel.states.add
	analyze:
		opacity: 1
		x:43
	organize:
		opacity: 0
		x:230				
		
wholeUsageColor.states.add
	analyze:
		scale:1
	organize:
		scale:0

for i in [0..5]
	usageDetailColors[i].states.add
		analyze:
			scale:1
			y:0
		organize:
			scale:0	
			y:100
			
	usageDetailLabels[i].states.add
		analyze:
			opacity:1
			y:0
		organize:
			opacity:0
			y:100
			
dataArea.states.add
	analyze:
		opacity: 0
		y:400
	organize:
		opacity: 1
		y:130			

subheader.states.add
	analyze:		
		y:10
	organize:		
		y:80			

operations.states.add
	analyze:
		opacity: 0
		scale:0.4
		y:230
	organize:
		opacity: 1
		scale:1
		y:130			


#Switch Instant
mainMenu.states.switchInstant("slideOut")
darkOverlay.states.switchInstant("fadeOut")
feedback.states.switchInstant("popIn")
speechBubble.states.switchInstant("close")
isFeedbackOpen=false

inOrganizeState=false
analyzeLabel.states.switchInstant("analyze")
organizeLabel.states.switchInstant("analyze")
sunburst.states.switchInstant("analyze")
wholeUsageLabel.states.switchInstant("analyze")
wholeUsageColor.states.switchInstant("analyze")
for i in [0..5]
	usageDetailColors[i].states.switchInstant("analyze")
	usageDetailLabels[i].states.switchInstant("analyze")
dataArea.states.switchInstant("analyze")
subheader.states.switchInstant("analyze")
operations.states.switchInstant("analyze")

#Events
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

sortByButton.onTap ->
	sortByMenu.visible=!sortByMenu.visible

toggleView.onMouseOver ->
	if inOrganizeState
		analyzeLabel.states.switch("hover",time:0.1)
	else
		organizeLabel.states.switch("hover",time:0.1)

toggleView.onMouseOut ->
	if inOrganizeState
		analyzeLabel.states.switch("normal",time:0.1)
	else
		organizeLabel.states.switch("normal",time:0.1)

toggleView.onTap ->
	delayStart=0
	delayInc=0.03
	time1=0.4
	time2=0.4
	transitionDelay=0.2
	if inOrganizeState # toggle to analyze state
		analyzeLabel.states.switch("analyze",time:time1)
		organizeLabel.states.switch("analyze",time:time1)
		sunburst.states.switch("analyze",time:time1,delay:transitionDelay)
		wholeUsageLabel.states.switch("analyze",time:time1,delay:transitionDelay)
		wholeUsageColor.states.switch("analyze",time:time1,delay:transitionDelay)
		d=delayStart
		for i in [0..5]
			usageDetailLabels[i].states.switch("analyze",time:time2,delay:d+transitionDelay)
			d+=delayInc	
		d=delayStart
		for i in [0..5]
			usageDetailColors[i].states.switch("analyze",time:time2,delay:d+transitionDelay)
			d+=delayInc
			
		dataArea.states.switch("analyze",time:time1,delay:0)
		operations.states.switch("analyze",time:time1,delay:0)
		subheader.states.switch("analyze",time:time1,delay:0)
		
		#remember to toggle off sortby menu in case it is open 
		sortByMenu.visible=false
	else # toggle to organize state
		analyzeLabel.states.switch("organize",time:time1)
		organizeLabel.states.switch("organize",time:time1)
		sunburst.states.switch("organize",time:time1)
		wholeUsageLabel.states.switch("organize",time:time1)
		wholeUsageColor.states.switch("organize",time:time1)
		d=delayStart
		for i in [5..0]
			usageDetailLabels[i].states.switch("organize",time:time2,delay:d)
			d+=delayInc
		d=delayStart
		for i in [5..0]
			usageDetailColors[i].states.switch("organize",time:time2,delay:d)
			d+=delayInc
			
		dataArea.states.switch("organize",time:time1,delay:transitionDelay)
		operations.states.switch("organize",time:time1,delay:transitionDelay)
		subheader.states.switch("organize",time:time1,delay:transitionDelay)
	inOrganizeState=!inOrganizeState	
