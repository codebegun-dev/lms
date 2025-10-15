package com.sample.test.oops;

public class Animal {
void sounds() {
	System.out.println("All  animals makes sounds");
}
}
class Dog extends Animal{
	void bark() {
		System.out.println("The dog is barking");
	}

public static void main(String[] args) {
	Dog dog=new Dog();
	dog.bark();
	dog.sounds();
	



}
}
