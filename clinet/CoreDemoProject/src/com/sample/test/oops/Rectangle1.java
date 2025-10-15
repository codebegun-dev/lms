package com.sample.test.oops;
//Create a class 'Rectangle' with method to calculate area and perimeter.
public class Rectangle1 {
	int area(int length,int breadth) {
		return length*breadth;
	}
	int perimeter(int length1,int breadth1) {
		return 2*length1*breadth1;
	}
	public static void main(String[] args) {
		Rectangle1 rectangle=new Rectangle1();
		System.out.println("The area of the rectangle:"+rectangle.area(4, 4));
		System.out.println("The perimeter of the rectangle:"+rectangle.perimeter(6, 2));
		
	}

}
