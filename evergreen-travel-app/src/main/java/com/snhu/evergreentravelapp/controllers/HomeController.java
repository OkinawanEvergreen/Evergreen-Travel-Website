package com.snhu.evergreentravelapp.controllers;

import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;

@Configuration
@CrossOrigin
		
public class HomeController implements WebMvcConfigurer {

	public void addViewControllers(ViewControllerRegistry registry) {
		//Group for adding Views
		//registry.addViewController("/").setViewName("home"); //Adds View for "home" html page when no tag is issued
		registry.addViewController("/home").setViewName("home"); //Adds View for "home" html page
		registry.addViewController("/about").setViewName("about"); //Adds View for "about" html page
		registry.addViewController("/contact").setViewName("contact"); //Adds View for "contact" html page
		registry.addViewController("/login").setViewName("login"); //Adds View for "login" html page
						
	}
}