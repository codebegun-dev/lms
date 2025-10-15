package com.sample.test.demo;
abstract class Movies{
	abstract void genre();
	void watch() {
		System.out.println("Movies gives us knowledge");
	}
}
class Adults extends Movies{
	void genre() {
		System.out.println(" Adults can watch Horror Movies");
	}
	
}
class Childs extends Adults{
	void genre() {
		System.out.println(" Childs  can watch sci-fi Movies");
	}
	Childs(){
		System.out.println("I am from child");
	}
	
}


public class MainAbstractDemo {

	public static void main(String[] args) {
		Movies adults=new Childs();
		adults.watch();
		adults.genre();

	}

}
