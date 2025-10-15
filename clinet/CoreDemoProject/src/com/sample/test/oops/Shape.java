package com.sample.test.oops;
//Create an abstract class 'Shape' with draw() and extend with Circle and Rectangle.
public abstract class Shape {
	abstract void draw();

}
class Circle extends Shape{
	void draw() {
		System.out.println("Draw a circle");
	}
}
class Rectangle extends Shape{
	void draw() {
		System.out.println("Draw the rectangle");
	}
	public static void main(String[] args) {
		Circle circle=new Circle();
		circle.draw();
		Rectangle rectangle=new Rectangle();
		rectangle.draw();
	}
}

