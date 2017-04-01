class Node:
	#for root node there is no parent
	def __init__(self, val, parent=None):
		self.value = val
		self.parent = parent
		self.children = []			

	def add(self, node):
		if isinstance(node, Node):
			node.parent = self;
			self.children.append(node)

	def hasChildren(self):
		return bool(self.children)

	def getNode(self, val):
		if self.value == val:
			return self
		else:
			if self.hasChildren():
				result = None
				for child in self.children:
					result = child.getNode(val)
					if result:
						break
				return result					
		return None		

	def isGoal(self, val):
		#if node is in tree return True else return False
		if self.value == val:
			return True
		else:
			if self.hasChildren():
				result = False
				for child in self.children:
					result = child.isGoal(val)
					if result:
						break
				return result
		return False
	
	#returns a list containing all the children of node; given node is unique
	def generateChildren(self):
		return self.children

#container class
class Tree:
	def __init__(self, node):
		self.root = node

	#returns root node of tree
	def getRoot(self):
		return self.root
	
	# will clear the tree making the root undefined 
	def clearTree(self):
		self.root = None

test = Tree(Node(1))
test.root.add(Node(2))
test.root.add(Node(3))

print("Root Children: ")
print(test.root.children)
print("Get Node 2: ")
print(test.root.getNode(2))
print("isGoal 3: ")
print(test.root.isGoal(3))
print("generateChildren 3: ")
print(test.root.generateChildren())