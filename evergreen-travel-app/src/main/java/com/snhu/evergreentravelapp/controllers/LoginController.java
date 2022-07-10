package com.snhu.evergreentravelapp.controllers;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@CrossOrigin
@RestController	
public class LoginController implements WebMvcConfigurer {

	public void addViewControllers(ViewControllerRegistry registry) {

		//Group for adding Viewss
		registry.addViewController("/").setViewName("login"); //Adds View for "home" html page when no tag is issued
		registry.addViewController("/login").setViewName("login"); //Adds View for "login" html page

	}


}