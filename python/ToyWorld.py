#TOYWORLD PYTHON

# from enum import Enum, unique
# import re

#decided to create enums for the names of states since
#it makes it easier to change the value when the need arises
#rather than having to search for hardcoded strings

#NOT ALLOWED TO USE ENUM SINCE IT USES IMPORTS -.-
# @unique
# class ToyState(Enum):

# 	def __str__(self):
# 		return self.name

# 	ON = "ON",
# 	CLEAR = "CLEAR",
# 	HEAVIER = "HEAVIER"

# @unique
# class ClearChoice(Enum):

# 	def __str__(self):
# 		return self.name

# 	PRIMARY = "PRIMARY",
# 	SECONDARY = "SECONDARY"

#Class used to identify the strings input and easily get data from them
class Proposition:
	'''Proposition Class makes it easier to decipher the string input'''
	def __init__(self, ToyState, primary, secondary = None):
		self.primary = primary
		if secondary is not None:
			self.secondary = secondary
		self.state = ToyState

	#getters
	def getState(self):
		return self.state

	def getPrimary(self):
		return self.primary

	def getSecondary(self):
		return self.secondary
	#end getters
	
	def __repr__(self):
		#checking if attribute exists
		if(hasattr(self, 'secondary')):
			string_rep = "%s(%s, %s)" % (self.state, self.primary, self.secondary)
		else:
			string_rep = "%s(%s)" % (self.state, self.primary)
		return string_rep		
	def __eq__(self, other):
		#making sure the compared object is an instance of the Proposition class
		if isinstance(other, type(self)):
			#check to see if both objects don't have the optional secondary param
			#if only one has then we know they are different anyway
			if(hasattr(self, 'secondary') and hasattr(other, 'secondary')):
				result = ((self.primary == other.primary) and (self.secondary == other.secondary) and (self.state == other.state))
			else:
				result = ((self.primary == other.primary) and (self.state == other.state))
		else:
			result = False
		return result			
	def __ne__(self, other):
		return (not self.__eq__(other))
	#hash is required when comparing objects
	#NOTE: must be immutable comparision in the case it isn't you can probably make an immutable copy
	#http://stackoverflow.com/questions/3942303/how-does-a-python-set-check-if-two-objects-are-equal-what-methods-does-an-o
	#only include properties that NEED to be compared in this case its all of them
	def __hash__(self):
		if(hasattr(self, 'secondary')):
			result =  hash((self.primary, self.secondary, self.state)) 
		else:
			result =  hash((self.primary, self.state)) 
		return result 

#function to convert the string input into the easier Proposition class format
def convertStrToProposition(prop_string):
	#this concatenates a None to the third param in case there is no secondary needed and slices to ensure length
	#apparently not allowed to use regular expressions -.-
	#prop_list = (re.findall(r"[\w']+", prop_string) + [None])[:3]
	#	return Proposition(ToyState[prop_list[0]], prop_list[1], prop_list[2])
	prop_string = prop_string.replace("(", " ")
	prop_string = prop_string.replace(",", " ")
	prop_string = prop_string.replace(")", " ")
	prop_list = prop_string.split()
	if len(prop_list) > 2:
		# prop = Proposition(ToyState[prop_list[0]], prop_list[1], prop_list[2])
		prop = Proposition(prop_list[0], prop_list[1], prop_list[2])
	else:
		#prop = Proposition(ToyState[prop_list[0]], prop_list[1])
		prop = Proposition(prop_list[0], prop_list[1])
	return prop

# print("TOY SET BEFORE " + str(toy_set_input))
# print("STATE SET BEFORE " + str(state_input))
# print("GOAL SET BEFORE " + str(goal_input))

#Main function handles all the processing of input and move funtionality then returns new state set
def processToyWorld(state_set, goal_set):
	#check if goals have been met
	while not goal_set.issubset(state_set) :

		#1st Find Goal to work on
		curGoal = findNextGoal(state_set, goal_set)
		if curGoal in state_set: #for heavier or any state already met
			print("Goal Already Met") # shouldn't get here but just for debugging
		else:
			#once goal is found I check the type of the goal and make it clear on both the x and z for the move preconditions to succeed
			if curGoal.getState() == "ON": #ToyState.ON:
				searchProp = Proposition("ON", curGoal.getPrimary(), None)#ToyState.ON
				curState = findPropsInPropList(searchProp, state_set, False)
				#iterate states to make sure it is clear with same primary
				isPrimaryClear = checkIsClear(curGoal.getPrimary(), state_set)			
				if not isPrimaryClear:
					state_set = makeClear("PRIMARY", curGoal, state_set)#ClearChoice.PRIMARY
				#check if secondary is Clear
				isSecondaryClear = checkIsClear(curGoal.getSecondary(), state_set)
				if not isSecondaryClear: 
					state_set = makeClear("SECONDARY", curGoal, state_set)#ClearChoice.SECONDARY
					#We can use the Move operator if these preconditions work
				#both are made clear so we can Move
				state_set = Move(curState.getPrimary(), curState.getSecondary(), curGoal.getSecondary(), state_set)

				#move after made clear
			else:# curGoal.getState() == ToyState.CLEAR:
				#do other stuff
				searchProp = Proposition("ON", None, curGoal.getPrimary())#ToyState.ON
				curState = findPropsInPropList(searchProp, state_set, False)
				if not checkIsClear(curGoal.getPrimary(), state_set):
					state_set = makeClear("PRIMARY", curGoal, state_set)#ClearChoice.PRIMARY
		
		#processToyWorld(state_set, goal_set)
	return state_set

#function to make goals PRIMARY/SECONDARY clear by iterating through children and moving when needed
def makeClear(clearChoiceType, goal, state_set, currentItems = None):
	#if not isinstance(clearChoiceType, ClearChoice):
	if not clearChoiceType in ["PRIMARY", "SECONDARY"]:
		print("Not in clear choice!")
	if clearChoiceType == "PRIMARY":#ClearChoice.PRIMARY
		clearGoalPart = goal.getPrimary()
	if clearChoiceType == "SECONDARY":#ClearChoice.SECONDARY
		clearGoalPart = goal.getSecondary()

	if currentItems is None:
		if clearChoiceType == "SECONDARY":#ClearChoice.SECONDARY
			currentItems = {Proposition("ON", goal.getSecondary(), None)}#ToyState.ON
		else:
			currentItems = {goal}
	isOriginalClear = checkIsClear(clearGoalPart, state_set)
	#continues until the original is made clear
	while not isOriginalClear:
		#make it sequence type so same code applies no differentiation
		foundClear = False
		totalPropsOnTop = set()
		#iterate the previous props to find ones on top of them
		for currentProp in currentItems:
			useProp = Proposition("ON", None, currentProp.getPrimary())#ToyState.ON
			propsOnTop = findPropsInPropList(useProp, state_set, True)
			#joining sets
			totalPropsOnTop |= propsOnTop
			for item in propsOnTop:
				#check for whether any clear props on top if there is 
				#look for clear props to move to else continue looking
				isClear = checkIsClear(item.getPrimary(), state_set)
				if not isClear:
					continue
				clearProp = findClearProp(item, goal, state_set)
				if clearProp is not None:
					foundClear = True		
					state_set = Move(item.getPrimary(), currentProp.getPrimary(), clearProp.getPrimary(), state_set)
					break;
			if foundClear:
				break;
		if foundClear:
			#if found clear we break both for loops and call the initial make clear
			currentItems = {goal}
			#makeClear(goal, state_set)
		else:		
		#once all props on top have been evauated but still no match found we repeat
			currentItems = totalPropsOnTop
		isOriginalClear = checkIsClear(goal.getPrimary(), state_set)
		#makeClear(goal, state_set, totalPropsOnTop)
	return state_set		

#function to find a clear proposition to use
def findClearProp(prop, goal, state_set):
	result = None
	for item in state_set:
		#cannot be the initial state or goal state and must be clear
		if item.getPrimary() != prop.getPrimary() and goal.getPrimary() != item.getPrimary() and item.getState() == "CLEAR":#ToyState.CLEAR
			#find if heavier props exist with the primary of clear prop
			result = findPropsInPropList(Proposition("HEAVIER", item.getPrimary(), prop.getPrimary()), state_set, False)#ToyState.HEAVIER
			#if no results come back we continue the original loop
			if result is not None:
				break
	return result

#checks if state corresponding to goalValue is Clear or not
def checkIsClear(goalValue, state_set):
	isClear = Proposition("CLEAR", goalValue) in state_set #ToyState.CLEAR
	return isClear

#returns proposition from list based on attributes
def findPropsInPropList(prop, prop_list, isListResult):
	result = set() if isListResult else None
	for item in prop_list:				
		primaryPart = item.getPrimary() == prop.getPrimary() if prop.getPrimary() is not None and hasattr(prop, 'primary') else True
		secondaryPart = item.getSecondary() == prop.getSecondary() if hasattr(item, 'secondary') and hasattr(prop, 'secondary') else True
		statePart = item.getState() == prop.getState() if prop.getState() is not None else True
		propMatch = primaryPart and secondaryPart and statePart

		if propMatch:
			if isListResult:
				result.add(item)
			else:
				result = item
				break			
	return result

#returns next unmet goal
def findNextGoal(state_set, goal_set):
	nextGoal = None
	#if not just get next unmet goal
	unmetGoals = []
	for goal in goal_set:
		nextGoal = goal
		for state in state_set:		
			#returns bool value for if any state is in goal_set
			if state == goal:
				nextGoal = None
				break
		if nextGoal is not None:
			unmetGoals.append(nextGoal)

	#set first element of unmet goals
	nextGoal = unmetGoals[0]

	#with goal find if any props under in goal list and check if any goals are clear for props under
	if nextGoal.getState() == "ON":#ToyState.ON
		currentPropBelow =  findPropsInPropList(Proposition("ON", nextGoal.getSecondary(), None), unmetGoals, False)#ToyState.ON
		while True:
			#condition breaks while loop emulates do while
			if currentPropBelow is None:
				break
			if currentPropBelow in unmetGoals:
				nextGoal = currentPropBelow
			currentPropBelow =  findPropsInPropList(Proposition("ON", currentPropBelow.getSecondary(), None), unmetGoals, False)#ToyState.ON

	#check if there is a clear prop under the current selected goal
	currentItems = {nextGoal}
	totalPropsBelow = set()
	foundGoal = False
	while True:
		#will check if empty set()
		if bool(currentItems):
			break
		for currentProp in currentItems:
			propsBelow = findPropsInPropList(Proposition("ON", currentProp.getSecondary(), None), state_set, True)#ToyState.ON
			#union of all props below props
			totalPropsBelow |= propsBelow
			for prop in propsBelow:
				clearProposition = Proposition("CLEAR", prop.getSecondary())#ToyState.CLEAR
				for goal in unmetGoals:
					if goal == clearProposition:
						foundGoal = True
						nextGoal = goal
						break
				if foundGoal:
					break
			if foundGoal:
				break
		currentItems = totalPropsBelow
	return nextGoal	

#move function to move one object on top of another if preconditions succeed
def Move(x, y, z, state_set):
	print("Move(" + x + ", " + y + ", " + z +")")
	#ToyState.ON, ToyState.CLEAR, ToyState.HEAVIER
	if (Proposition("ON", x, y) in state_set and
	  Proposition("CLEAR", z) in state_set and
	  Proposition("CLEAR", x) in state_set and
	  Proposition("HEAVIER", z, x) in state_set):

		#add items
		state_set.add(Proposition("ON", x, z))#ToyState.ON
		state_set.add(Proposition("CLEAR", y))#ToyState.CLEAR

		#remove items
		removeSet = {curState for curState in state_set if (curState == Proposition("ON", x, y) or curState == Proposition("CLEAR", z))}	#ToyState.ON, ToyState.CLEAR
		state_set = {x for x in state_set if x not in removeSet}			
	return state_set


############# INPUTS ######################################################################################################################################
#TEST 1
# toy_in = "table1 table2 A"
# state_in = "ON(A,table1) HEAVIER(table1,A) HEAVIER(table2,A) CLEAR(A) CLEAR(table2)"
# goal_in = "CLEAR(table1) CLEAR(A)"

#TEST 2
# toy_in = "A B C T1 T2"
# state_in = "CLEAR(B) ON(B,C) ON(C,A) ON(A,T1) CLEAR(T1) CLEAR(T2) HEAVIER(B,A) HEAVIER(C,B) HEAVIER(T1,B) HEAVIER(T2,C)"
# goal_in = "ON(A,B) ON(B,C) ON(C,T2)"

#TEST 3
# toy_in = "A B P1 P2 T1 T2 T3"
# state_in = "CLEAR(P2) ON(P2,A) ON(A,T2) ON(T2,B) CLEAR(T1) CLEAR(P1) HEAVIER(A,P2) HEAVIER(T2,A) HEAVIER(B,P2) HEAVIER(P1,P2) HEAVIER(T1,A) HEAVIER(P1,T2)"
# goal_in = "ON(P2,A) ON(A,T2) ON(T2,P1)"

#INPUTS
# toy_set_input = set(toy_in.split())
# state_input = set(state_in.split())
# goal_input = set(goal_in.split())

toy_set_input = set(input("Please enter a space seperated list of unique names ").split())
state_input = set(input("Please enter a string describing the initial state ").split())
goal_input = set(input("Please enter a string describing the goal ").split())

###########################################################################################################################################################

#converting string set to class set, apply function to every item of the state_input set
proposition_set = set(map(convertStrToProposition, state_input))
goal_set = set(map(convertStrToProposition, goal_input))
result_state_set = processToyWorld(proposition_set, goal_set)
print("RESULT SET = " + str(result_state_set))