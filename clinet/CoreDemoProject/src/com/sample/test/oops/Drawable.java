package com.sample.test.oops;
/*Assignment 2: Shape Interface and Abstract Class
Create an interface Drawable with method draw().
Create an abstract class Shape with an abstract method area().
Create multiple subclasses like Circle, Rectangle, etc., that implement both and calculate area accordingly.
Use interface + abstract class combination.*/
//public interface Drawable {
//	void draw() ;
//	
//	}
//
//abstract class Shape1{
//	
//	abstract double area(double b,double c);
//	 
//	
//}
//class Circle1 extends Shape1 implements Drawable{
//	
//	 double area(double b,double c) {
//		 return 3.14*b*c;
//	 }
//	public void draw() {
//		System.out.println("draw a circle");
//	}
//}
//class Rectangle2 extends Shape1 implements Drawable{
//	
//	double area(double b,double c) {
//		 return b*c;
//	 }
//	public void draw() {
//		System.out.println("draw a rectangle");
//	}
//}
//class Triangle extends Shape1 implements Drawable{
//	double area(double a) {
//		return 0;
//	}
//	double area(double b,double c) {
//		 return b*c/2;
//	 }
//	public void draw() {
//		System.out.println("draw a triangle");
//	}
//	public static void main(String[] args) {
//		
//		Circle1 circle=new Circle1();
//		System.out.println( "The area of circle is:"+circle.area(4, 1));
//		circle.draw();
//		Rectangle2 rectangle=new Rectangle2();
//		System.out.println("The area of rectangle is:"+rectangle.area(3, 6));
//		rectangle.draw();
//		Triangle triangle=new Triangle();
//		System.out.println("The area of triangle is:"+triangle.area(5, 7));
//		triangle.draw();
//		
//	}
//}
interface Drawable{
	void draw();
}
abstract class Shape1 implements Drawable{
	abstract double area();
}
class Circle1 extends Shape1{
	private  double radius;
	Circle1(double radius){
		this.radius=radius;
	}
	 public void draw() {
		System.out.println("Draw a circle");
	}
	double area() {
		return radius*radius;
	}

}
class Rectangle2 extends Shape1{
	private double length;
	private double breadth;
	Rectangle2(double length,double breadth){
		this.length=length;
		this.breadth=breadth;
	}
	 public void draw() {
		System.out.println("Draw the rectangle");
	}
	 double area() {
		 return length*breadth;
	 }
	 public static void main(String[] args) {
		 Circle1 circle=new Circle1(6);
		 circle.draw();
		 System.out.println("The area of circle is:"+circle.area());
		 Rectangle2 rectangle=new Rectangle2(3,6);
		 rectangle.draw();
		 System.out.println("The area of rectangle is:"+rectangle.area());
		 
	}
}

