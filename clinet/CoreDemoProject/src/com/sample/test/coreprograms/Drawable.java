package com.sample.test.coreprograms;

public interface Drawable {
 void drawable();
}
abstract class Shape{
	abstract  void shape();
}
class Circle extends Shape implements Drawable{
	
	void shape() {
		System.out.println("Area of circle");
	}
	public void drawable() {
		System.out.println("Drawing circle");
	}
}
class Main{
	public static void main(String args[]) {
		Circle circle=new Circle();
		circle.drawable();
		circle.shape();
		
	}
}
