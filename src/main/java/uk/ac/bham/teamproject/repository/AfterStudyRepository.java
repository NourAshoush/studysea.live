package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.AfterStudy;

/**
 * Spring Data JPA repository for the AfterStudy entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AfterStudyRepository extends JpaRepository<AfterStudy, Long> {}
