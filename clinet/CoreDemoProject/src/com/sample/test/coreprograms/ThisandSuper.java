package com.sample.test.coreprograms;

public class ThisandSuper {
	int a=20;
	}
	class Super extends ThisandSuper{
		int a=40;
		void display() {
		System.out.println("This is local variable :"+this.a);
		System.out.println("This is global variable :"+super.a);
		}
		public static void main(String[] args) {
		Super sup=new Super();
		sup.display();
			
		
	}

}
